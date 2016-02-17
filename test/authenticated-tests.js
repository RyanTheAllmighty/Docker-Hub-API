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

    const expect = require('chai').expect;

    const dhAPI = require('../src/api');

    let loginToken = process.env.DOCKER_HUB_LOGIN_TOKEN;

    describe('Docker Hub API - Logging In', function () {
        this.timeout(10000);

        before(function () {
            dhAPI.setCacheOptions({enabled: false});
        });

        describe('#login', function () {
            it('should login to a Docker Hub account', function () {
                return dhAPI.login(process.env.DOCKER_HUB_USERNAME, process.env.DOCKER_HUB_PASSWORD).then(function (info) {
                    expect(info).to.not.be.an('undefined');

                    loginToken = info.token;

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
                dhAPI.setLoginToken(loginToken);

                return dhAPI.loggedInUser().then(function (info) {
                    expect(info).to.have.property('id');
                    expect(info).to.have.property('username');
                    expect(info).to.have.property('is_admin');
                });
            });
        });
    });

    describe('Docker Hub API - Authenticated Routes', function () {
        this.timeout(10000);

        before(function () {
            dhAPI.setCacheOptions({enabled: true});
            dhAPI.setLoginToken(loginToken);
        });

        describe('#loggedInUser', function () {
            it('should get information about the logged in user', function () {
                return dhAPI.loggedInUser().then(function (info) {
                    expect(info).to.have.property('id');
                    expect(info).to.have.property('username');
                    expect(info).to.have.property('is_admin');
                });
            });
        });

        describe('#setRepositoryDescription', function () {
            it('should set the descriptions for a repository', function () {
                return dhAPI.loggedInUser().then(function (user) {
                    return dhAPI.repositories(user.username).then(function (repos) {
                        if (repos.length === 0) {
                            expect([]).to.be.an('undefined'); // Fail this test since we cannot progress
                        }

                        return dhAPI.repository(user.username, repos[0].name).then(function (repo) {
                            return dhAPI.setRepositoryDescription(user.username, repos[0].name, {short: repo.description, full: repo.full_description}).then(function (info) {
                                expect(info).to.have.property('user');
                                expect(info).to.have.property('name');
                            });
                        });
                    });
                });
            });
        });

        describe('Starring Repository Methods', function () {
            describe('#starRepository', function () {
                it('should star a given repository', function () {
                    return dhAPI.loggedInUser().then(function (user) {
                        return dhAPI.repositories(user.username).then(function (repos) {
                            if (repos.length === 0) {
                                expect([]).to.be.an('undefined'); // Fail this test since we cannot progress
                            }

                            return dhAPI.starRepository(user.username, repos[0].name);
                        });
                    });
                });
            });

            describe('#unstarRepository', function () {
                it('should star a given repository', function () {
                    return dhAPI.loggedInUser().then(function (user) {
                        return dhAPI.repositories(user.username).then(function (repos) {
                            if (repos.length === 0) {
                                expect([]).to.be.an('undefined'); // Fail this test since we cannot progress
                            }

                            return dhAPI.unstarRepository(user.username, repos[0].name);
                        });
                    });
                });
            });
        });

        describe('Creating Repository Methods', function () {
            let repositoryName = `test-${Date.now() / 1000}`;

            describe('#createRepository', function () {
                it('should create a repository', function () {
                    return dhAPI.loggedInUser().then(function (user) {
                        return dhAPI.createRepository(user.username, repositoryName, {is_private: false, description: 'Test', full_description: 'Test'}).then(function (info) {
                            expect(info).to.be.an('object');
                            expect(info).to.have.property('user');
                            expect(info).to.have.property('name');
                            expect(info).to.have.property('is_private');
                            expect(info.user).to.equal(user.username);
                            expect(info.name).to.equal(repositoryName);
                            expect(info.is_private).to.equal(false);
                        });
                    });
                });
            });

            describe('#deleteRepository', function () {
                it('should delete a repository', function () {
                    return dhAPI.loggedInUser().then(function (user) {
                        return dhAPI.deleteRepository(user.username, repositoryName);
                    });
                });
            });
        });

        describe('#webhooks', function () {
            it('should get the webhooks for a repository', function () {
                return dhAPI.loggedInUser().then(function (user) {
                    return dhAPI.repositories(user.username).then(function (repos) {
                        if (repos.length === 0) {
                            expect([]).to.be.an('undefined'); // Fail this test since we cannot progress
                        }

                        return dhAPI.webhooks(user.username, repos[0].name).then(function (info) {
                            expect(info).to.be.an('array');
                        });
                    });
                });
            });
        });

        describe('Webhook Modifying Methods', function () {
            let webhookName = `Test-${Date.now() / 1000}`;
            let webhookID;

            it('should create a webhook for a repository', function () {
                return dhAPI.loggedInUser().then(function (user) {
                    return dhAPI.repositories(user.username).then(function (repos) {
                        if (repos.length === 0) {
                            expect([]).to.be.an('undefined'); // Fail this test since we cannot progress
                        }

                        return dhAPI.createWebhook(user.username, repos[0].name, webhookName).then(function (info) {
                            expect(info).to.be.an('object');
                            expect(info).to.have.property('id');
                            expect(info).to.have.property('name');
                            expect(info.name).to.equal(webhookName);

                            webhookID = info.id;
                        });
                    });
                });
            });

            it('should create a webhook hook for an existing webhook', function () {
                return dhAPI.loggedInUser().then(function (user) {
                    return dhAPI.repositories(user.username).then(function (repos) {
                        if (repos.length === 0) {
                            expect([]).to.be.an('undefined'); // Fail this test since we cannot progress
                        }

                        return dhAPI.createWebhookHook(user.username, repos[0].name, webhookID, 'http://www.example.com').then(function (info) {
                            expect(info).to.be.an('object');
                            expect(info).to.have.property('id');
                            expect(info).to.have.property('hook_url');
                            expect(info.hook_url).to.equal('http://www.example.com');
                        });
                    });
                });
            });

            it('should delete a webhook for a repository', function () {
                return dhAPI.loggedInUser().then(function (user) {
                    return dhAPI.repositories(user.username).then(function (repos) {
                        if (repos.length === 0) {
                            expect([]).to.be.an('undefined'); // Fail this test since we cannot progress
                        }

                        return dhAPI.deleteWebhook(user.username, repos[0].name, webhookID).then(function () {
                            expect([]).to.be.an('array'); // If were here we're all good
                        });
                    });
                });
            });
        });
    });
})();