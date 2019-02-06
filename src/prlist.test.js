import {
    fetchPullRequests, fetchPagedQuery, fetchPRDetails, fetchPullRequestsPaged
} from './prlist';
import { DEFAULT_OWNER, DEFAULT_REPO, GITHUB_FETCH_LIMIT } from './gitHub';

// test.config.js must be created from test.config.js.in
// It is done this way to be able to pass GitHub token while not having it in
// source control.
import config from './test.config';

it('can fetch pr list', async() => {
    let repository = await fetchPullRequests({
            token: config.token,
            state: "OPEN",
            numOfPrs: 2
    });
    let prs = repository.pullRequests.nodes;
    expect(prs).toHaveLength(2);
    let pr = prs[0];
    expect(pr).toHaveProperty("state", "OPEN");
    expect(pr).toHaveProperty("number");
    expect(pr).toHaveProperty("title");
    expect(pr).toHaveProperty("author");
});

test.only('paged query with details', async() => {
    let numOfPRs = 10 + 1;
    let prs;
    try {
        prs = await fetchPagedQuery({
            owner: DEFAULT_OWNER,
            repoName: DEFAULT_REPO,
            token: config.token,
            numOfPrs: numOfPRs,
            filter: "Nightly PR"
        });
    } catch {
        expect.not.anything()
    }
    expect(prs.length).toBeGreaterThan(0);

    let filteredLength = prs.length;
    let expectedLength = filteredLength > GITHUB_FETCH_LIMIT ?
        GITHUB_FETCH_LIMIT : filteredLength;

    prs = await fetchPRDetails(prs, config.token);
    expect(prs).toHaveLength(expectedLength);
    let pr = prs[0];
    expect(pr).toHaveProperty("number");
    expect(pr).toHaveProperty("title");
    expect(pr).toHaveProperty("author");
}, 20000);

test('combined paged query', async() => {
    let numOfPRs = 10 + 1;
    let prs = await fetchPullRequestsPaged({
        owner: DEFAULT_OWNER,
        repoName: DEFAULT_REPO,
        token: config.token,
        numOfPrs: numOfPRs,
        filter: "Nightly PR"
    });

    expect(prs).toHaveLength(numOfPRs);
    let pr = prs[0];
    expect(pr).toHaveProperty("number");
    expect(pr).toHaveProperty("title");
    expect(pr).toHaveProperty("author");
}, 20000);