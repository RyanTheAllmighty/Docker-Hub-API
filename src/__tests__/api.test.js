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

const dhAPI = require('../api');

describe('Docker Hub API', function() {
    describe('#comments', function() {
        test('should fetch all the repositories for a user', function() {
            return dhAPI.comments('nginx').then(function(info) {
                expect(Array.isArray(info)).toBeTruthy();
                expect(info[0]).toHaveProperty('id');
                expect(info[0]).toHaveProperty('comment');
            });
        });
    });

    describe('#repository', function() {
        test('should fetch details about an official nginx image', function() {
            return dhAPI.repository('nginx').then(function(info) {
                expect(info.user).toBe('library');
                expect(info.name).toBe('nginx');
            });
        });

        test('should fetch details about an official nginx image when _ is passed in as the username', function() {
            return dhAPI.repository('_', 'nginx').then(function(info) {
                expect(info.user).toBe('library');
                expect(info.name).toBe('nginx');
            });
        });

        test('should fetch details about a given users image', function() {
            return dhAPI.repository('atlauncher', 'discord-bot').then(function(info) {
                expect(info.user).toBe('atlauncher');
                expect(info.name).toBe('discord-bot');
            });
        });

        test('should fetch details about a given users image when the username is not all lowercase', function() {
            return dhAPI.repository('ATLauncher', 'discord-bot').then(function(info) {
                expect(info.user).toBe('atlauncher');
                expect(info.name).toBe('discord-bot');
            });
        });
    });

    describe('#repositories', function() {
        test('should fetch all the repositories for a user', function() {
            return dhAPI.repositories('ryantheallmighty').then(function(info) {
                expect(Array.isArray(info)).toBeTruthy();
                expect(info[0]).toHaveProperty('namespace', 'ryantheallmighty');
            });
        });
    });

    describe('#repositoriesStarred', function() {
        test('should fetch all the stars for a given user', function() {
            return dhAPI.repositoriesStarred('ryantheallmighty').then(function(info) {
                expect(Array.isArray(info)).toBeTruthy();
                expect(info[0]).toHaveProperty('user', 'atlauncher');
            });
        });
    });

    describe('#tags', function() {
        test('should fetch all the tags for an official repository', async function() {
            const info = await dhAPI.tags('nginx');

            expect(info[0]).toHaveProperty('repository', 21171);
        });

        test('should fetch a single result per page for an official repository', async function() {
            const info = await dhAPI.tags('nginx', { perPage: 1 });

            expect(info).toHaveLength(1);
            expect(info[0]).toHaveProperty('repository', 21171);
        });

        test('should fetch all the tags for a given users repository', async function() {
            const info = await dhAPI.tags('atlauncher', 'discord-bot');

            expect(info[0]).toHaveProperty('repository', 961530);
        });

        test('should fetch a single result per page for a given users repository', async function() {
            const info = await dhAPI.tags('atlauncher', 'discord-bot', { perPage: 1 });

            expect(info).toHaveLength(1);
            expect(info[0]).toHaveProperty('repository', 961530);
        });
    });

    describe('#user', function() {
        test('should fetch details about a user', function() {
            return dhAPI.user('ryantheallmighty').then(function(info) {
                expect(info).toHaveProperty('id', '73cdba6ec4154672a2ef01c292f38567');
                expect(info).toHaveProperty('username', 'ryantheallmighty');
            });
        });
    });
});

describe.skip('Docker Hub API - Logging In', function() {
    before(function() {
        dhAPI.setCacheOptions({ enabled: false });
    });

    describe('#login', function() {
        test('should login to a Docker Hub account', function() {
            return dhAPI
                .login(process.env.DOCKER_HUB_USERNAME, process.env.DOCKER_HUB_PASSWORD)
                .then(function(info) {
                    expect(info).not.toBeUndefined();

                    loginToken = info.token;

                    return dhAPI.loggedInUser();
                })
                .then(function(info) {
                    expect(info).toHaveProperty('id');
                    expect(info).toHaveProperty('username');
                    expect(info).toHaveProperty('is_admin');
                });
        });
    });

    describe('#setLoginToken', function() {
        test('should allow authenticated requests after setting the login token', function() {
            dhAPI.setLoginToken(process.env.DOCKER_HUB_LOGIN_TOKEN);

            return dhAPI.loggedInUser().then(function(info) {
                expect(info).toHaveProperty('id');
                expect(info).toHaveProperty('username');
                expect(info).toHaveProperty('is_admin');
            });
        });
    });
});

describe.skip('Docker Hub API - Authenticated Routes', function() {
    beforeEach(function() {
        dhAPI.setCacheOptions({ enabled: true });
        dhAPI.setLoginToken(process.env.DOCKER_HUB_LOGIN_TOKEN);
    });

    describe('#loggedInUser', function() {
        test('should get information about the logged in user', function() {
            return dhAPI.loggedInUser().then(function(info) {
                expect(info).toHaveProperty('id');
                expect(info).toHaveProperty('username');
                expect(info).toHaveProperty('is_admin');
            });
        });
    });

    describe('#setRepositoryDescription', function() {
        test('should set the descriptions for a repository', function() {
            return dhAPI.loggedInUser().then(function(user) {
                return dhAPI.repositories(user.username).then(function(repos) {
                    if (repos.length === 0) {
                        expect([]).toBeUndefined(); // Fail this test since we cannot progress
                    }

                    return dhAPI.repository(user.username, repos[0].name).then(function(repo) {
                        return dhAPI
                            .setRepositoryDescription(user.username, repos[0].name, {
                                short: repo.description,
                                full: repo.full_description,
                            })
                            .then(function(info) {
                                expect(info).toHaveProperty('user');
                                expect(info).toHaveProperty('name');
                            });
                    });
                });
            });
        });
    });

    describe('Starring Repository Methods', function() {
        describe('#starRepository', function() {
            test('should star a given repository', function() {
                return dhAPI.loggedInUser().then(function(user) {
                    return dhAPI.repositories(user.username).then(function(repos) {
                        if (repos.length === 0) {
                            expect([]).toBeUndefined(); // Fail this test since we cannot progress
                        }

                        return dhAPI.starRepository(user.username, repos[0].name);
                    });
                });
            });
        });

        describe('#unstarRepository', function() {
            test('should star a given repository', function() {
                return dhAPI.loggedInUser().then(function(user) {
                    return dhAPI.repositories(user.username).then(function(repos) {
                        if (repos.length === 0) {
                            expect([]).toBeUndefined(); // Fail this test since we cannot progress
                        }

                        return dhAPI.unstarRepository(user.username, repos[0].name);
                    });
                });
            });
        });
    });

    describe('Creating Repository Methods', function() {
        let repositoryName = `test-${Date.now() / 1000}`;

        describe('#createRepository', function() {
            test('should create a repository', function() {
                return dhAPI.loggedInUser().then(function(user) {
                    return dhAPI
                        .createRepository(user.username, repositoryName, {
                            is_private: false,
                            description: 'Test',
                            full_description: 'Test',
                        })
                        .then(function(info) {
                            expect(info).toMatchObject({
                                user: user.username,
                                name: repositoryName,
                                is_private: false,
                            });
                        });
                });
            });
        });

        describe('#deleteRepository', function() {
            test('should delete a repository', function() {
                return dhAPI.loggedInUser().then(function(user) {
                    return dhAPI.deleteRepository(user.username, repositoryName);
                });
            });
        });
    });

    describe('#webhooks', function() {
        test('should get the webhooks for a repository', function() {
            return dhAPI.loggedInUser().then(function(user) {
                return dhAPI.repositories(user.username).then(function(repos) {
                    if (repos.length === 0) {
                        expect([]).toBeUndefined(); // Fail this test since we cannot progress
                    }

                    return dhAPI.webhooks(user.username, repos[0].name).then(function(info) {
                        expect(Array.isArray(info)).toBeTruthy();
                    });
                });
            });
        });
    });

    describe('Webhook Modifying Methods', function() {
        let webhookName = `Test-${Date.now() / 1000}`;
        let webhookID;

        test('should create a webhook for a repository', function() {
            return dhAPI.loggedInUser().then(function(user) {
                return dhAPI.repositories(user.username).then(function(repos) {
                    if (repos.length === 0) {
                        expect([]).toBeUndefined(); // Fail this test since we cannot progress
                    }

                    return dhAPI
                        .createWebhook(user.username, repos[0].name, webhookName)
                        .then(function(info) {
                            expect(info).toHaveProperty('id');
                            expect(info).toHaveProperty('name', webhookName);

                            webhookID = info.id;
                        });
                });
            });
        });

        test('should create a webhook hook for an existing webhook', function() {
            return dhAPI.loggedInUser().then(function(user) {
                return dhAPI.repositories(user.username).then(function(repos) {
                    if (repos.length === 0) {
                        expect([]).toBeUndefined(); // Fail this test since we cannot progress
                    }

                    return dhAPI
                        .createWebhookHook(
                            user.username,
                            repos[0].name,
                            webhookID,
                            'http://www.example.com',
                        )
                        .then(function(info) {
                            expect(info).toHaveProperty('id');
                            expect(info).toHaveProperty('hook_url', 'http://www.example.com');
                        });
                });
            });
        });

        test('should delete a webhook for a repository', function() {
            return dhAPI.loggedInUser().then(function(user) {
                return dhAPI.repositories(user.username).then(function(repos) {
                    if (repos.length === 0) {
                        expect([]).toBeUndefined(); // Fail this test since we cannot progress
                    }

                    return dhAPI
                        .deleteWebhook(user.username, repos[0].name, webhookID)
                        .then(function() {
                            expect(true).toBeTruthy(); // If were here we're all good
                        });
                });
            });
        });
    });
});
