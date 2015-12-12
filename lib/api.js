/*
 * Docker Hub API - https://github.com/RyanTheAllmighty/Docker-Hub-API
 * Copyright (C) 2015 RyanTheAllmighty
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
    'use strict';

    //let _ = require('lodash');
    let request = require('request');

    let apiVersion = 2;

    let cache = {};
    let cacheEnabled = true;
    let cacheTimeSeconds = 300;

    let loggedInToken = null;

    module.exports = {
        /**
         * This logs into Docker Hub with the given username and password.
         *
         * You may choose to bypass this by providing a login token directly via the setLoginToken(token) method.
         *
         * @param {String} username - the username of your Docker Hub account
         * @param {String} password - the password for that Docker Hub account
         * @returns {Promise}
         */
        login: function (username, password) {
            return new Promise(function (resolve, reject) {
                if (!username || !password) {
                    return reject(new Error('Both username and password must be passed to this function!'));
                }

                this.makePostRequest('users/login/', {username, password}).then(function (info) {
                    if (!info.token) {
                        return reject(new Error('Error logging into Docker Hub! No login token sent back!'));
                    }

                    loggedInToken = info.token;

                    return resolve(info);
                }).catch(reject);
            }.bind(this));
        },
        /**
         * This gets information about the current logged in user.
         *
         * @returns {Promise}
         */
        loggedInUser: function () {
            return new Promise(function (resolve, reject) {
                if (!loggedInToken) {
                    return reject(new Error('No login token found! Please login() or setLoginToken() to continue!'));
                }

                this.makeGetRequest('user/').then(resolve).catch(reject);
            }.bind(this));
        },
        /**
         * This will set the caching options.
         *
         * @param {{enabled: Boolean, time: Number}} options - the options to set for the caching options
         */
        setCacheOptions: function (options) {
            if (options.enabled) {
                cacheEnabled = options.enabled;
            }

            if (options.time) {
                cacheTimeSeconds = options.time;
            }

            // Clear the cache
            cache = {};
        },
        /**
         * This sets the login token for authenticated Docker Hub requests.
         *
         * @param {String} token - the login token for Docker Hub
         */
        setLoginToken: function (token) {
            loggedInToken = token;
        },
        /**
         * Gets the details about a repository.
         *
         * @param {String} [username] - the username of the repository to get information about. If left out or '_' is provided then it will query the official Docker repository with the given name
         * @param {String} name - the name of the repository to get information about
         * @returns {Promise}
         */
        repository: function (username, name) {
            // If no name is passed in, then the user wants an official repository
            if (username && !name) {
                name = username;
                username = 'library';
            }

            // If username is '_' then we're trying to get an official repository
            if (username === '_') {
                username = 'library';
            }

            // Make sure the username is all lowercase as per Docker Hub requirements
            username = username.toLowerCase();

            return this.makeGetRequest(`repositories/${username}/${name}`);
        },
        /**
         * Gets the repositories for a user.
         *
         * @param {String} username - the username to get the repositories for
         * @returns {Promise}
         */
        repositories: function (username) {
            return new Promise(function (resolve, reject) {
                if (!username) {
                    return reject(new Error('Username must be provided!'));
                }

                // Make sure the username is all lowercase as per Docker Hub requirements
                username = username.toLowerCase();

                this.makeGetRequest(`users/${username}/repositories`).then(resolve).catch(reject);
            }.bind(this));
        },
        /**
         * Gets the starred repositories for a user.
         *
         * @param {String} username - the username to get the starred repositories for
         * @param {{page: Number, perPage: Number}} [options] - the options for this call
         * @returns {Promise}
         */
        repositoriesStarred: function (username, options) {
            return new Promise(function (resolve, reject) {
                if (!username || typeof username !== 'string') {
                    return reject(new Error('Username must be provided!'));
                }

                if (!options) {
                    options = {page: 1, perPage: 100};
                }

                // Make sure the username is all lowercase as per Docker Hub requirements
                username = username.toLowerCase();

                this.makeGetRequest(`users/${username}/repositories/starred?page_size=${options.perPage || 100}&page=${options.page || 1}`, 'results').then(resolve).catch(reject);
            }.bind(this));
        },
        /**
         * Gets the tags for a repository.
         *
         * @param {String} [username] - the username of the repository to get tags for. If left out or '_' is provided then it will query the official Docker repository with the given name
         * @param {String} name - the name of the repository to get tags for
         * @param {{page: Number, perPage: Number}} [options] - the options for this call
         * @returns {Promise}
         */
        tags: function (username, name, options) {
            // If no name is passed in, then the user wants an official repository
            if (username && !name && !options) {
                name = username;
                username = 'library';
                options = {page: 1, perPage: 100};
            } else if (username && name && !options) {
                if (name instanceof Object) {
                    options = name;
                    name = username;
                    username = 'library';
                } else {
                    options = {page: 1, perPage: 100};
                }
            }

            // If username is '_' then we're trying to get an official repository
            if (username === '_') {
                username = 'library';
            }

            // Make sure the username is all lowercase as per Docker Hub requirements
            username = username.toLowerCase();

            return this.makeGetRequest(`repositories/${username}/${name}/tags?page_size=${options.perPage || 100}&page=${options.page || 1}`, 'results');
        },
        /**
         * Gets the details about a user.
         *
         * @param {String} username - the username to get information about
         * @returns {Promise}
         */
        user: function (username) {
            return new Promise(function (resolve, reject) {
                if (!username) {
                    return reject(new Error('Username must be provided!'));
                }

                // Make sure the username is all lowercase as per Docker Hub requirements
                username = username.toLowerCase();

                this.makeGetRequest(`users/${username}`).then(resolve).catch(reject);
            }.bind(this));
        },
        /**
         * Makes a raw get request to the Docker Hub API.
         *
         * @param {String} path - the path to fetch
         * @param {String} [extract] - the name of the property in the resulting JSON to extract. If left blank it will return the entire JSON
         * @returns {Promise}
         */
        makeGetRequest(path, extract) {
            return new Promise(function (resolve, reject) {
                // Normalize the path so it doesn't start with a slash
                if (path.substr(0, 1) === '/') {
                    path = path.substr(1);
                }

                // Also add a slash to the end of the path unless there is a ? in the path
                if (path.substr(-1) !== '/' && path.indexOf('?') === -1) {
                    path = path + '/';
                }

                let url = `https://hub.docker.com/v${apiVersion}/${path}`;

                if (cacheEnabled && cache.hasOwnProperty(url)) {
                    if (Date.now() >= cache[url].expires) {
                        delete cache[url];
                    } else {
                        return resolve(cache[url].data);
                    }
                }

                let headers = {};

                if (loggedInToken) {
                    headers.Authorization = `JWT ${loggedInToken}`;
                }

                request({url, method: 'get', json: true, headers}, function (err, res, body) {
                    if (err) {
                        return reject(err);
                    }

                    // If the body has a detail property, it's only because there's an error I've found
                    if (body.detail) {
                        return reject(new Error(body.detail));
                    }

                    if (cacheEnabled) {
                        cache[url] = {expires: (Date.now() + (cacheTimeSeconds * 1000)), data: body};
                    }

                    if (extract && body.hasOwnProperty(extract)) {
                        return resolve(body[extract]);
                    }

                    return resolve(body);
                });
            }.bind(this));
        },
        /**
         * Makes a raw post request to the Docker Hub API.
         *
         * @param {String} path - the path to fetch
         * @param {Object} data - the data to send
         * @param {String} [extract] - the name of the property in the resulting JSON to extract. If left blank it will return the entire JSON
         * @returns {Promise}
         */
        makePostRequest(path, data, extract) {
            return new Promise(function (resolve, reject) {
                if (!data || typeof data !== 'object') {
                    return reject(new Error('Data must be passed to all POST requests in the form of an object!'));
                }

                // Normalize the path so it doesn't start with a slash
                if (path.substr(0, 1) === '/') {
                    path = path.substr(1);
                }

                // Also add a slash to the end of the path unless there is a ? in the path
                if (path.substr(-1) !== '/' && path.indexOf('?') === -1) {
                    path = path + '/';
                }

                let url = `https://hub.docker.com/v${apiVersion}/${path}`;

                let headers = {};

                if (loggedInToken) {
                    headers.Authorization = `JWT ${loggedInToken}`;
                }

                request({url, method: 'post', body: data, json: true, headers}, function (err, res, body) {
                    if (err) {
                        return reject(err);
                    }

                    // If the body has a detail property, it's only because there's an error I've found
                    if (body.detail) {
                        return reject(new Error(body.detail));
                    }

                    if (extract && body.hasOwnProperty(extract)) {
                        return resolve(body[extract]);
                    }

                    return resolve(body);
                });
            }.bind(this));
        }
    };
})();