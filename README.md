# Docker-Hub-API
[![Build Status](https://img.shields.io/travis/RyanTheAllmighty/Docker-Hub-API.svg?style=flat-square)](https://travis-ci.org/RyanTheAllmighty/Docker-Hub-API)
[![NPM Downloads](https://img.shields.io/npm/dt/docker-hub-api.svg?style=flat-square)](https://www.npmjs.com/package/docker-hub-api)
[![NPM Version](https://img.shields.io/npm/v/docker-hub-api.svg?style=flat-square)](https://www.npmjs.com/package/docker-hub-api)
[![Issues](https://img.shields.io/github/issues/RyanTheAllmighty/Docker-Hub-API.svg?style=flat-square)](https://github.com/RyanTheAllmighty/Docker-Hub-API/issues)
[![License](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat-square)](https://raw.githubusercontent.com/RyanTheAllmighty/Docker-Hub-API/master/LICENSE)

Docker Hub API is an API library written for NodeJS to access the official Docker Hub/Registry.

## Install
To install this package into your project simply run the following:

```sh
npm install --save docker-hub-api
```

Once installed you can start to use this package by requiring the module:

```js
let dockerHubAPI = require('docker-hub-api');
```

## Support
If you're having issues please feel free to [open an issue](https://github.com/RyanTheAllmighty/Docker-Hub-API/issues/new).

## Testing & Linting
To run this applications tests and linter, simply install Gulp globally with the below command:

```
npm install -g gulp
```

Then run the following command in the directory this repository was cloned into:

```
gulp
```

The gulpfile gives access to a few methods shown below:

- jscs: Runs the JSCS tool to check JS code.
- jshint: Runs the JSHint tool to check JS code.
- test: Runs the mocha tests.
- style: Runs the jscs and jshint tasks to check JS code.
- watch: Runs all 3 main tasks and then watches for file changes to rerun those tasks constantly as files are changed.

By default Gulp is set to run the jscs, jshint and test tasks when no arguments are provided to it.

## Coding standards & styling guidelines
Please see the [STYLE.md](https://github.com/RyanTheAllmighty/Docker-Hub-API/blob/master/STYLE.md) file for coding standards and style guidelines.

## License
This work is licensed under the GNU General Public License v3.0. To view a copy of this license, visit http://www.gnu.org/licenses/gpl-3.0.txt.
