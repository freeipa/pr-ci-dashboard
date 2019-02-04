import {fetchPullRequests} from './prlist';

// test.config.js must be created from test.config.js.in
// It is done this way to be able to pass GitHub token while not having it in
// source control.
import config from './test.config';

it('can fetch pr list', async() => {
    let prs = await fetchPullRequests({
            token: config.token,
            state: "open",
            numOfPrs: 20
    });
    expect(prs.data);
    expect(prs.data.repository.url).toBe("https://github.com/freeipa/freeipa");
});