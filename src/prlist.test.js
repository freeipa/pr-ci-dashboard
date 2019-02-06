import {fetchPullRequests} from './prlist';

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