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

    describe('#repository', function () {
        it('should fetch details about an official nginx image', function () {
            return dhAPI.repository('nginx').then(function (info) {
                expect(info.user).to.equal('library');
                expect(info.name).to.equal('nginx');
            });
        });

        it('should fetch details about a given users nginx image', function () {
            return dhAPI.repository('ryantheallmighty', 'nginx').then(function (info) {
                expect(info.user).to.equal('ryantheallmighty');
                expect(info.name).to.equal('nginx');
            });
        });

        it('should fetch details about a given users nginx image when the username is not all lowercase', function () {
            return dhAPI.repository('RyanTheAllmighty', 'nginx').then(function (info) {
                console.log(info);
                expect(info.user).to.equal('ryantheallmighty');
                expect(info.name).to.equal('nginx');
            });
        });
    });
})();