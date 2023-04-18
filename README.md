# A Dashboard for FreeIPA Pull Request CI

**Note:** this project is no longer being developed and the production instance
was decommissioned.

A Dashboard for [FreeIPA PR-CI](https://github.com/freeipa/freeipa-pr-ci).

A FreeIPA PR-CI is test executioner tool which can be configured to watch a
Git Hub repository. This is a simple dashboard for it. Biggest benefit is an
ability to see history of nightly runs and other UX simplification not available
in GitHub user interface.

Intended minimal feature set is not yet implemented but the project already
provides value.

## How to use

As a prerequisite, install [Node.JS](https://nodejs.org).

On Fedora:

```bash
# dnf install nodejs
```

NPM with React Scripts will do the rest.

```bash
$ npm install # installs dependencies
$ npm run debug # starts backend + server with react app
```

## Authentication

Login page requires to enter GitHub token which is able to read freeipa/freeipa
pull requests.

This token is store in browser localStorage. The app doesn't store any data
besides the localStorage.

## Code

This project was bootstrapped by [Create React App](https://github.com/facebookincubator/create-react-app) tool. For more details
about React development see [README-react.md](./README-react.md)

## Test

First-time prep:

```bash
# until GitHub API usage is mocked, following is needed:
$ cp src/test.config.js.in src/test.config.js
# vim src/test.config.js # and add token there
```

Then

``` bash
$ npm run test
```

## Run in production

Assuming desired port is 8888.

```bash
$ npm run build
$ PORT=8888 node server/server.js
```

Alternatively after build:
```bash
$ npm run start
```

## Deployed instance

This project is deployed at https://ci.freeipa.org

## Philosophy behind the project

FreeIPA pull request CI runs test jobs and produces artifacts. It does not
implement a GUI for viewing results as it is not its job. It's a job of this
project.

In essence:

* FreeIPA PR-CI runs a job and produces artifacts
* It also produces metadata files containing info about the artifacts
* Dashboard consumes the metadata files and shows in user consumable way
  to increase productivity of test reviewer

## Backend

The intention was that it will not have a backend. But Pagure API, which is used
for fetching reported tickets, doesn't support CORS. Backed which contains
a simple Pagure proxy was added as a workaround for this limitation.