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

    let _ = require('lodash');
    let request = require('request');

    let apiVersion = 2;

    let cache = {};
    let cacheEnabled = true;
    let cacheTimeSeconds = 300;

    module.exports = {
        /**
         * This will set the caching options.
         *
         * @param {{enabled: {Boolean}, time: {Number}}} options - the options to set for the caching options
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
         * Makes a raw get request to the Docker Hub API.
         *
         * @param {String} path - the path to fetch
         * @returns {Promise}
         */
        makeGetRequest(path) {
            return new Promise(function (resolve, reject) {
                // Normalize the path so it doesn't start with a slash and also ends with a slash
                if (path.substr(0, 1) === '/') {
                    path = path.substr(1);
                }

                if (path.substr(-1) !== '/') {
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

                request({url, method: 'get', json: true}, function (err, res, body) {
                    if (err) {
                        return reject(err);
                    }

                    if (cacheEnabled) {
                        cache[url] = {expires: (Date.now() + (cacheTimeSeconds * 1000)), data: body};
                    }

                    return resolve(body);
                });
            }.bind(this));
        }
    };
})();