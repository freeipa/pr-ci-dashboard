// Download information about PRs from GitHub using v4 API - GraphQL

// Requires token ID - authentication using OAuth2 is not implemented as it
// requires clients secret and this app should run with public source code
// without server side.

const DEFAULT_OWNER = "freeipa"
const DEFAULT_REPO = "freeipa";
const DEFAULT_PRS = 50;

function createQuery(owner, repoName, numOfPrs, state)
{
    let stateQuery = ''
    if (state) {
        stateQuery = `, states: ${state}`
    }

    // query can be tuned in GitHub GraphQL explorer
    // https://developer.github.com/v4/explorer/
    // cost of this query is 1
    let query = `
    query { repository(owner: "${owner}", name: "${repoName}") {
        url
        pullRequests(last: ${numOfPrs}${stateQuery}) {
            nodes {
                state
                number
                title
                author {
                    login
                }
                baseRefName
                mergeable
                createdAt
                updatedAt
                labels(last: 5) {
                    nodes {
                        name
                    }
                }
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
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    rateLimit {
        limit
        cost
        remaining
        resetAt
        }
    }
    `
    return query;
}

/**
 * Fetch pull request data from Git Hub using CORS GraphQL request
 *
 * @param {[token]:string,*} fetchOptions
 */
export function fetchPullRequests(fetchOptions) {
    let options = {};
    let defaults = {
        owner: DEFAULT_OWNER,
        repoName: DEFAULT_REPO,
        numOfPrs: DEFAULT_PRS
    }
    Object.assign(options, defaults, fetchOptions);

    const query = createQuery(options.owner, options.repoName,
                              options.numOfPrs);
    const init_obj = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${options.token}`,
            'Content-Type': "application/json"
        },
        mode: "cors",
        body: JSON.stringify({query: query})
    };

    const p = window.fetch('https://api.github.com/graphql', init_obj)
        .then(response => response.json()).then(json => json);
    return p;
};
