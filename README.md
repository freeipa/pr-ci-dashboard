# FreeIPA Pull Request CI - Dashboard

A Dashboard for [FreeIPA PR-CI](https://github.com/freeipa/freeipa-pr-ci).

A FreeIPA PR-CI is test executioner tool which can be configured to watch a
Git Hub repository

This project was bootstrapped by [Create React App](https://github.com/facebookincubator/create-react-app) tool. For more details
about React development see [README-react.md](./README-react.md)

## Start coding

As a prerequisite, install [Node.JS](https://nodejs.org) with
[yarn](https://yarnpkg.com). Yarn with React Scripts will do the rest.

```bash
$ yarn install
$ yarn start
```

## Test

First-time prep:
```
# until GitHub API usage is mocked, following is needed:
$ cp src/test.config.js.in src/test.config.js
# vim src/test.config.js # and add token there
```

Then

``` bash
$ yarn test
```

## Deploy

```bash
$ TBD
```

## Demo

Not available yet.

## Philosophy behind the project

FreeIPA pull request CI runs test jobs and produces artifacts. It does not
implement a GUI for viewing results as it is not its job. It's a job of this
project.

In essence:

* FreeIPA PR-CI runs a job and produces artifacts
* It also produces metadata files containing info about the artifacts
* Dashboard consumes the metadata files and shows in user consumable way
  to increase productivity of test reviewer