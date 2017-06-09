[![Build Status](https://travis-ci.org/angarg12/nucleogenesis.svg?branch=master)](https://travis-ci.org/angarg12/nucleogenesis)
[![Test Coverage](https://codeclimate.com/github/angarg12/nucleogenesis/badges/coverage.svg)](https://codeclimate.com/github/angarg12/nucleogenesis/coverage)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/angarg12/nucleogenesis/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/angarg12/nucleogenesis/?branch=master)
[![Code Climate](https://codeclimate.com/github/angarg12/incremental_table_elements/badges/gpa.svg)](https://codeclimate.com/github/angarg12/incremental_table_elements)
[![Dependency Status](https://gemnasium.com/badges/github.com/angarg12/nucleogenesis.svg)](https://gemnasium.com/github.com/angarg12/nucleogenesis)
[![devDependencies Status](https://david-dm.org/angarg12/nucleogenesis/dev-status.svg)](https://david-dm.org/angarg12/nucleogenesis?type=dev)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fangarg12%2Fnucleogenesis.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fangarg12%2Fnucleogenesis?ref=badge_shield)

<p align="center">
<img width="155" heigth="155" src="https://rawgit.com/angarg12/nucleogenesis/master/img/logo.svg"/>
</p>
<p align="center">
<img  width="300" src="https://rawgit.com/angarg12/nucleogenesis/master/img/title.png"/>
</p>

# Players

Nucleogenesis is a chemistry-based incremental/idle game.

* [The Incremental Table of the Elements](https://angarg12.github.io/IncrementalTableElements/), v1, current release.
* [Nucleogenesis](https://angarg12.github.io/nucleogenesis/), v2, currently in beta.

# Contributors

## Get involved

* We use [Github](https://github.com/angarg12/nucleogenesis/issues) to report bugs. If you find a bug, please open an issue.
* We use a [Fork-PR workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962) to accept code changes. In the issue tracker we keep a list of features and enhancements that we plan to work on.
* The [Wiki](https://github.com/angarg12/nucleogenesis/wiki) is open for collaborators. Feel free to add or improve information for other players.

## Quickstart

    git clone
    https://github.com/angarg12/nucleogenesis.git
    cd nucleogenesis
    npm install
    gulp build

The `build/` folder will include a working copy of the game.

## Stack

Nucleogenesis uses the following technologies/tools:

* [AngularJS](https://angularjs.org/) as a JS framework.
* [Node.js](https://nodejs.org/en/) for build scripts.
* [Gulp](http://gulpjs.com/) as a task runner.
* [Karma](https://karma-runner.github.io/1.0/index.html) + [Jasmine](https://jasmine.github.io/) for unit tests. Runs on Chrome and Firefox.
* [Protractor](http://www.protractortest.org/) for end-to-end tests. Runs on Chrome.

## Environments: src vs build vs dist

Nucleogenesis is divided in 3 environments; src, build and dist.

The src folder contains the source code for data, views and code, split in several files. Some of these scripts have lodash templates. This code needs to be processed to be executed.

The build environment generates derived data from the source code, and fills in the lodash templates. A build step downloads the runtime dependencies and places files in the right structure. It also packs all JS source files and data together in a single file. Code in the build environment can be executed. 

The dist environment generates the final distributable code from the Build environment. It minifies the code and removes unnecessary source files. Optionally, this step can perform extra sanity checks.

## Code structure

The main files/folder are:

* `package.json`: Development dependencies.
* `bower.json`: Runtime dependencies.
* `Gulpfile.js`: Gulp tasks definition.
* `build_scripts`: Contains scripts that run during the build step. The generate derived data and fill in source templates.
* `test/integration`: e2e tests.
* `test/unit`: Unit tests.
* `src/data`: Game data. Mostly json files.
* `src/html`: HTML views.
* `src/styles`: CSS styles.
* `src/scripts/component`: Components for the game views. Roughly speaking each tab in the game is a view/component pair.
* `src/scripts/controllers/main-loop.js`: Game main loop. 
* `src/scripts/services`: Services with common functionality that span several components. For instance, util or savegame. 

## Gulp tasks

Gulp has the following public tasks:

* `build`: Builds the code.
* `build-unit-test`: Builds the code and runs unit tests on it.
* `dist`: Builds the distributable code.
* `unit-test`: Builds the distributable code and runs unit tests on it.
* `e2e-test`: Builds the distributable code and runs end-to-end tests on it.
* `test`: Builds the distributable code and runs unit and end-to-end tests on it.

## Good practices

We run CI and code analysis on the code in master and for each PR. We try to maintain high quality code by using good programming practices, testing and reviews.

While coding, we recommend to run `build-unit-test` often to check that no unintended effects are introduced. Before submitting a PR, a full `test` should be run to check the build integrity.

Use tasks to discuss implementation or design of features. The PRs will be used to review and comment on the code. PRs that break the build, don't provide enough testing or enough quality will require changes.

# License

[GPL-3.0](LICENSE)

Derivative works should include attribution to the original author, Andrés Garcia Garcia (angarg12).
