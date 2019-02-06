import {
    DEFAULT_OWNER, DEFAULT_REPO, isAuthenticated, logout, createAuthTestQuery,
    gitHubQuery, gitHubJSONQuery, authenticate} from './gitHub';
import localStorageMock from './mocks/localStorageMock';

// test.config.js must be created from test.config.js.in
// It is done this way to be able to pass GitHub token while not having it in
// source control.
import config from './test.config';

localStorageMock.register();

function checkNotAuthenticated(error) {
    expect(error).toBeInstanceOf(Error);
    expect(error).toHaveProperty('message', 'Not authenticated');
}

it('can authenticate with defaults', async() => {
    let status = await authenticate(config.token);
    expect(status).toBe(true);
    expect(isAuthenticated()).toBe(true);
}, 10000);

it('cannot authenticate without token', async() => {
    const empty = [null, undefined, ''];
    for (var element of empty) {
        try {
            await authenticate(element);
        } catch (error) {
            checkNotAuthenticated(error);
        }
        expect(isAuthenticated()).toBe(false);
    };
});

it('cannot authenticate with bad token', async() => {
    let status = await authenticate('randomtext');
    expect(status).toBe(false);
    expect(isAuthenticated()).toBe(false);
}, 10000);

test('createAuthTestQuery to contain query', () => {
    let query = createAuthTestQuery(DEFAULT_OWNER, DEFAULT_REPO);
    expect(typeof query).toBe('string');
    expect(query).toMatch('query');
});

test('that logout means not authenticated', () => {
    logout();
    expect(isAuthenticated()).toBe(false);
});

it('cannot execute query without token (auth)', async() => {
    expect.assertions(2);
    let query = createAuthTestQuery(DEFAULT_OWNER, DEFAULT_REPO);
    try {
        await gitHubQuery(query)
    } catch (e) {
        checkNotAuthenticated(e);
    }
});

it('can authenticate', async() => {
    let status = await authenticate(config.token, DEFAULT_OWNER,  DEFAULT_REPO);
    expect(status).toBe(true);
    expect(isAuthenticated()).toBe(true);
});

function checkQueryResult(content) {
    expect(content).toHaveProperty('data.repository.name', DEFAULT_REPO);
    expect(content).toHaveProperty('data.rateLimit.limit', 5000);
    expect(content).toHaveProperty('data.rateLimit.cost', 1);
}

it('can execute query after auth', async() => {
    let query = createAuthTestQuery(DEFAULT_OWNER, DEFAULT_REPO);
    let response = await gitHubQuery(query);
    expect(response.ok).toBe(true);
    let json = await response.json()
    checkQueryResult(json);
});

it('can execute query with token after logout', async() => {
    expect(localStorageMock).toHaveProperty('setItem');
    logout();
    expect(isAuthenticated()).toBe(false);

    let query = createAuthTestQuery(DEFAULT_OWNER, DEFAULT_REPO);
    let response = await gitHubQuery(query, config.token);
    expect(response.ok).toBe(true);
    let json = await response.json()
    checkQueryResult(json);
}, 10000);

test('gitHubJSONQuery to get JSON', async() => {
    let query = createAuthTestQuery(DEFAULT_OWNER, DEFAULT_REPO);
    let data = await gitHubJSONQuery(query, config.token);
    expect(data).toHaveProperty('repository.name', DEFAULT_REPO);
    expect(data).toHaveProperty('rateLimit.limit', 5000);
    expect(data).toHaveProperty('rateLimit.cost', 1);
}, 10000);