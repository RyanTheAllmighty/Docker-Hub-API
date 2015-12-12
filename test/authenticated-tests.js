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

    let expect = require('chai').expect;

    let dhAPI = require('../lib/api');

    describe('Docker Hub API - Authenticated Routes', function () {
        this.timeout(10000);

        describe('#login', function () {
            it('should login to a Docker Hub account', function () {
                return dhAPI.login(process.env.DOCKER_HUB_USERNAME, process.env.DOCKER_HUB_PASSWORD).then(function (info) {
                    expect(info).to.not.be.an('undefined');

                    return dhAPI.loggedInUser();
                }).then(function (info) {
                    expect(info).to.have.property('id');
                    expect(info).to.have.property('username');
                    expect(info).to.have.property('is_admin');
                });
            });
        });

        describe('#setLoginToken', function () {
            it('should allow authenticated requests after setting the login token', function () {
                dhAPI.setCacheOptions({enabled: false});
                dhAPI.setLoginToken(process.env.DOCKER_HUB_LOGIN_TOKEN);

                return dhAPI.loggedInUser().then(function (info) {
                    expect(info).to.have.property('id');
                    expect(info).to.have.property('username');
                    expect(info).to.have.property('is_admin');
                    dhAPI.setCacheOptions({enabled: true});
                });
            });
        });
    });
})();