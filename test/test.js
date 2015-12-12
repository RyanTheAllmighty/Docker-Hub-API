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

        it('should fetch details about an official nginx image when _ is passed in as the username', function () {
            return dhAPI.repository('_', 'nginx').then(function (info) {
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
                expect(info.user).to.equal('ryantheallmighty');
                expect(info.name).to.equal('nginx');
            });
        });
    });

    describe('#repositories', function () {
        it('should fetch all the repositories for a user', function () {
            return dhAPI.repositories('ryantheallmighty').then(function (info) {
                expect(info).to.be.an('array');
                expect(info[0]).to.have.property('namespace').and.equal('ryantheallmighty');
            });
        });
    });

    describe('#tags', function () {
        it('should fetch all the tags for an official repository', function () {
            return dhAPI.tags('nginx').then(function (info) {
                expect(info).to.be.an('array');
                expect(info.length).to.not.equal(1);
                expect(info[0]).to.have.property('repository').and.equal(21171);
            });
        });

        it('should fetch all the tags for a given users repository', function () {
            return dhAPI.tags('ryantheallmighty', 'nginx').then(function (info) {
                expect(info).to.be.an('array');
                expect(info.length).to.not.equal(1);
                expect(info[0]).to.have.property('creator').and.equal(534804);
            });
        });

        it('should fetch a single result per page for an official repository', function () {
            return dhAPI.tags('nginx', {perPage: 1}).then(function (info) {
                expect(info).to.be.an('array');
                expect(info.length).to.equal(1);
                expect(info[0]).to.have.property('repository').and.equal(21171);
            });
        });

        it('should fetch a single result per page for a given users repository', function () {
            return dhAPI.tags('ryantheallmighty', 'nginx', {perPage: 1}).then(function (info) {
                expect(info).to.be.an('array');
                expect(info.length).to.equal(1);
                expect(info[0]).to.have.property('creator').and.equal(534804);
            });
        });
    });

    describe('#user', function () {
        it('should fetch details about a user', function () {
            return dhAPI.user('ryantheallmighty').then(function (info) {
                expect(info.id).to.equal('73cdba6ec4154672a2ef01c292f38567');
                expect(info.username).to.equal('ryantheallmighty');
            });
        });
    });
})();