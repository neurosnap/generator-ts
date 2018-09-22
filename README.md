# Packages

Get a webapp up and running with one command.

This yeoman generator does two things:

* It creates the scaffolding for a typescript/react/redux/packages app.
* It creates an interface to build new packages

## Inspiration

Scaling a react/redux application is difficult and the traditional layer-based
organization starts showing its cracks quickly.  In my experience a better approach
is a feature-based organization and this generator helps building that organization
easier.

Read the blog article on the underlying philosophy:
https://github.com/neurosnap/blog/blob/master/scaling-js-codebase-multiple-platforms.md

## Stack

* typescript
* webpack
* react
* redux
* redux-saga
* redux-cofx
* TSLint
* prettier

## Features

* Sets up scaffolding for a web app without connecting all the pieces
* Folder-based folder organization
* Packages are referenced absolutely by the namespace defined when running the command, e.g. `import auth from '@myapp/auth';`
* Built for scalability, composability, and reusability

## Getting started

* Install [yeoman](http://yeoman.io/) `yarn global add yo`
* Install generator-packages `yarn global add generator-packages`
* Navigate to the project folder

```bash
yo packages
```

Follow the steps to complete it!

Then run the dev server:

```bash
make dev
```

Open browser to http://localhost:8000

### What does the command do?

Once the command finishes, it will copy files into project folder, install all necessary dependencies,
and allow the developer to start building quickly

```bash
<project-folder>/
  packages/          # all features are built as if they were npm packages here
    web-app/         # this is the main web-app package that brings all other packages together
      app.ts         # root react component that pulls everything together
      index.ts       # init file that creates redux and renders `app`
      packages.ts    # where all packages are registered and loaded into redux/redux-saga
      store.ts       # redux store and middleware setup
      types.ts       # redux State definition
  public/
    index.html       # main html file
    index.css        # a place to put global css
  webpack/           # webpack files for dev and prod
    common.js
    dev.js
    prod.js
  .gitignore
  index.ts           # this is what webpack uses as the entry point to the app
  jest.config.js     # jest configuration file for testing
  Makefile           # all task runner commands
  package.json
  prettier.config.js # js auto formatter
  README.md
  tests.js           # file that jest uses before every test
  tsconfig.js        # typescript configuration file
  tslint.json        # lint configuration file
```

## Creating new packages

The primary command simply builds the scaffolding for the app, the next step
is to add new features to the application.

```bash
yo packages:create
```

Follow the steps to complete it!

This will create a new package under `packages` where the developer can start
building the feature.  It will also link the package up to the main `web-app`
by adding the package to the `web-app/packages.ts` file.  This is necessary in order
for any reducers or sagas that were built in the new package.

### What does the command do?

The `:create` command will build a new feature and create some example files
of how to setup a new package.  A package can technically have any interface,
but for the main layers of the application, the index.ts file `should` export the following:

```js
interface Module {
  reducers?: { [key: string]: (state: any, action: any) => any };
  sagas?: { [key: string]: () => void };
  effects?: { [key: string]: (action: any) => any };
  selectors?: { [key: string]: (state: any) => any };
  actions?: { [key: string]: (payload: any) => { type: string; payload: any } };
}
```

Keep in mind, they are all optional, but if you want the `web-app` to add a
packages `reducers` then it must be exports as a key, and that applies for
every other layer in the package.

Let's say the new feature is named `todo`

```bash
<project-folder>/
  packages/
    todo/
      actions.ts
      index.ts
      reducers.ts
      sagas.ts
      selectors.ts
      types.ts
```

This command will also add the package to the `packages.ts` file.

For example here is a diff of `packages.ts`:

```diff
import { combineReducers, Reducer } from 'redux';

import use from 'redux-package-loader';
import sagaCreator from 'redux-saga-creator';

import { State } from './types';

const corePackages = [
  require('@myapp/auth'),
+ require('@myapp/todo'),
];

// this will automatically grab all reducers and sagas for each package and load
// them into the rootReducer and rootSaga
const packages = use(corePackages);
const rootReducer: Reducer<State> = combineReducers(packages.reducers);
const rootSaga = sagaCreator(packages.sagas);

export { packages, rootReducer, rootSaga };
```
