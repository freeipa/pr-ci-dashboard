// Download information about PRs from GitHub using v4 API - GraphQL

// Requires token ID - authentication using OAuth2 is not implemented as it
// requires clients secret and this app should run with public source code
// without server side.

import {
    DEFAULT_OWNER, DEFAULT_REPO, gitHubJSONQuery, GITHUB_FETCH_LIMIT
 } from './gitHub';

const DEFAULT_PRS = 5;

const RATE_LIMIT =
`rateLimit {
    limit
    cost
    remaining
    resetAt
}`;

const DETAILED_PR_FIELDS =
`
    state
    number
    title
    baseRefName
    mergeable
    createdAt
    updatedAt
    url
`;

const PR_AUTHOR_FIELDS =
`
    author {
        login
        url
        avatarUrl
    }
`;

const PR_LABELS_FIELDS =
`
    labels(last: 10) {
        nodes {
            name
            color
            description
        }
    }
`;

const CI_INFO_FIELDS =
`
    commits(last: 1) {
        nodes {
            commit {
                oid
                status {
                    id
                    contexts {
                        id
                        context
                        description
                        state
                        targetUrl
                        creator {
                            login
                            avatarUrl
                        }
                    }
                }
            }
        }
    }
`;

function createPRFilter(numOfPrs, state, orderBy, cursor) {
    let opt = [];
    if (numOfPrs) {
        opt.push(['first', numOfPrs]);
    }
    if (state) {
        opt.push([['states'], state]);
    }
    if (cursor) {
        opt.push(['after', `"${cursor}"`]);
    }
    if (orderBy) {
        opt.push(['orderBy', orderBy]);
    }
    opt = opt.map(o => `${o[0]}: ${o[1]}`);
    return opt.join(', ')
}


function createQuery(owner, repoName, numOfPrs, state)
{
    let prFilter = createPRFilter(
        numOfPrs, state, "{field: CREATED_AT, direction: DESC}", null);

    // query can be tuned in GitHub GraphQL explorer
    // https://developer.github.com/v4/explorer/
    // cost of this query is 1
    let query = `
    query {
        repository(owner: "${owner}", name: "${repoName}" ) {
            url
            pullRequests(${prFilter}) {
                nodes {
                    ${DETAILED_PR_FIELDS}
                    ${PR_AUTHOR_FIELDS}
                    ${PR_LABELS_FIELDS}
                    ${CI_INFO_FIELDS}
                }
            }
        }
        ${RATE_LIMIT}
    }
`
    return query;
}


function pagedQuery(owner, repoName, numOfPrs, state, cursor) {

    let prFilter = createPRFilter(
        numOfPrs, state, "{field: CREATED_AT, direction: DESC}", cursor);

    let query =
    `
    query allButSmall{
        repository(owner: "${owner}", name: "${repoName}") {
            url
            pullRequests(${prFilter}) {
                nodes {
                    id,
                    title,
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
        ${RATE_LIMIT}
    }
    `;
    return query;
}

function detailsQuery(prs) {

    let ids = prs.map(pr => `"${pr.id}"`);
    let id_str = ids.join(", ");

    let query =
    `
    query list{
        nodes(ids:[${id_str}]) {
            ...on PullRequest {
                ${DETAILED_PR_FIELDS}
                ${PR_AUTHOR_FIELDS}
                ${PR_LABELS_FIELDS}
                ${CI_INFO_FIELDS}
            }
        }
        ${RATE_LIMIT}
    }
    `;
    return query;
}

/**
 * Recursivly fetch list of PRs (only id and title)
 * @param {function} resolve Is call when all data are fetched
 * @param {*} reject
 * @param {*} prs Target array which should be filled with fetched PRs
 * @param {*} owner Repository owner
 * @param {*} repoName Repository name
 * @param {*} numOfPrs Number of PRs to fetch
 * @param {*} state OPEN, CLOSED or none for both
 * @param {*} cursor Cursor from previous fetch, use null for first call
 */
function fetchNext(resolve, reject, prs, owner, repoName, numOfPrs, state, cursor, token) {
    let numToFetch = numOfPrs > GITHUB_FETCH_LIMIT ? GITHUB_FETCH_LIMIT : numOfPrs;
    let query = pagedQuery(owner, repoName, numToFetch, state, cursor);
    let p = gitHubJSONQuery(query, token).then(data => {
        prs.push.apply(prs, data.repository.pullRequests.nodes);
        let remaining = numOfPrs-numToFetch;
        let pageInfo = data.repository.pullRequests.pageInfo;
        if (pageInfo.hasNextPage && remaining > 0) {
            return fetchNext(resolve, reject, prs, owner, repoName,
                remaining, state, pageInfo.endCursor, token);
        } else {
            resolve(prs);
        }
    });
    return p;
}

/**
 * Filters list of PRs (title + id)
 * @param {Array} prs
 * @param {String} filter
 * @return {Array} Filtered PRs
 */
function filter(prs, filter) {
    let filtered = [];
    if (!filter) return prs.concat([]);
    for (let pr of prs) {
        if (pr.title.indexOf(filter) > 0) {
            filtered.push(pr);
        }
    }
    return filtered;
}

export function fetchPagedQuery(options) {
    return new Promise ((resolve, reject) => {
        fetchNext(resolve, reject, [], options.owner, options.repoName,
            options.numOfPrs, options.state, null, options.token);
    }).then(prs => {
        return filter(prs, options.filter);
    });
}

export function fetchPRDetails(prs, token) {
    if (prs.length > GITHUB_FETCH_LIMIT) {
        prs = prs.slice(0, GITHUB_FETCH_LIMIT);
    }
    let query = detailsQuery(prs);
    return gitHubJSONQuery(query, token).then(data => {
        return data.nodes;
    });
}

function prepOptions(fetchOptions) {
    let options = {};
    let defaults = {
        owner: DEFAULT_OWNER,
        repoName: DEFAULT_REPO,
        numOfPrs: DEFAULT_PRS
    };
    Object.assign(options, defaults, fetchOptions);
    return options;
}

/**
 * Fetch pull request data from Git Hub using CORS GraphQL request
 *
 * If numOfPrs > 100 (GitHub hard limit), it will do several paged searches.
 *
 * If filter is passed it will first query the number of PRs and then filter it
 * on browser side by presences of strings in title.
 *
 * @param {
 *   [numOfPrs]:Number,
 *   [token]:string,
 *   [filter]:string,
 * } fetchOptions
 */
export async function fetchPullRequestsPaged(fetchOptions) {
    let options = prepOptions(fetchOptions);
    return fetchPagedQuery(options).then(prs => {
        return fetchPRDetails(prs, options.token);
    });
}


/**
 * Fetch pull request data from Git Hub using CORS GraphQL request
 * *
 * @param {
 *   [numOfPrs]:Number,
 *   [token]:string,
 * } fetchOptions
 */
export async function fetchPullRequests(fetchOptions) {

    let options = prepOptions(fetchOptions);
    const query = createQuery(options.owner, options.repoName,
                              options.numOfPrs, options.state);

    return gitHubJSONQuery(query, options.token).then(data => data.repository);
};
