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

## Caching
This package will be default cache all calls to the same resource for 5 minutes so that calls to the same resource returning the same data will not re query the Docker Hub API.

This can be turned off or the expire time adjusted by adding the following code:

```js
let dockerHubAPI = require('docker-hub-api');
dockerHubAPI.setCacheOptions({enabled: true, time: 60}); // This will enable the cache and cache things for 60 seconds
```

## Usage
This is a complete list of methods available from this package. All methods return ES6 promises.

### repository(username, name)
This gets information about a repository with a given name. If the username is left out or '_' is provided, then it will get the base library repositories (official repositories).

Below is a sample of what's returned:

```json
{
    "user": "ryantheallmighty",
    "name": "nginx",
    "namespace": "ryantheallmighty",
    "status": 1,
    "description": "A short description",
    "is_private": false,
    "is_automated": false,
    "can_edit": false,
    "star_count": 0,
    "pull_count": 55,
    "last_updated": "2015-12-10T08:48:49.665081Z",
    "has_starred": false,
    "full_description": "A full description"
}
```

### repositories(username)
This gets information about a user's repositories.

Below is an example of what's returned:

```json
[
    {
        "namespace": "ryantheallmighty",
        "name": "composer"
    },
    {
        "namespace": "ryantheallmighty",
        "name": "hhvm"
    }
]
```

### tags(username, repository, options)
This gets the tags for a given repository/user combination. As per the [repository](#repository-username-repository) method above, if the username is left out, it will query the official repository.

You can also pass in options to limit the number of reaults per page and the page to go to like so:

```js
{
    perPage: 10,
    page: 4
}
```

Below is an example of what's returned:

```json
[
    {
        "name": "latest",
        "full_size": 61215330,
        "id": 1493440,
        "repository": 433668,
        "creator": 534804,
        "last_updater": 534804,
        "last_updated": "2015-12-10T08:48:48.697697Z",
        "image_id": null,
        "v2": true
    }
]
```

### user(username)
This gets information about a user with the given username.

Below is an example of what's returned:

```json
{
    "id": "73cdba6ec4154672a2ef01c292f38567",
    "username": "ryantheallmighty",
    "full_name": "Ryan Dowling",
    "location": "Victoria, Australia",
    "company": "ATLauncher",
    "profile_url": "",
    "date_joined": "2015-12-01T10:42:00.663328Z",
    "gravatar_url": "https://secure.gravatar.com/avatar/af74a121defc2d50f39c7ee3641131cc.jpg?s=80&r=g&d=mm"
}
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
