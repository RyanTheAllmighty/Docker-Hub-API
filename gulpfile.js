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

    const gulp = require('gulp');
    const jscs = require('gulp-jscs');
    const mocha = require('gulp-mocha');
    const jshint = require('gulp-jshint');

    const options = {
        files: {
            js: ['lib/**/*.js', 'test/**/*.js'],
            tests: ['test/**/*.js']
        }
    };

    gulp.task('jshint', function () {
        return gulp.src(options.files.js)
            .pipe(jshint())
            .pipe(jshint.reporter())
            .pipe(jshint.reporter('fail'));
    });

    gulp.task('jscs', function () {
        return gulp.src(options.files.js)
            .pipe(jscs())
            .pipe(jscs.reporter())
            .pipe(jscs.reporter('fail'));
    });

    gulp.task('test', function () {
        return gulp.src(options.files.tests)
            .pipe(mocha({
                reporter: 'min',
                clearRequireCache: true,
                ignoreLeaks: true
            }));
    });

    gulp.task('watch', function () {
        gulp.watch(options.files.js, ['jshint', 'jscs', 'test']);
        gulp.start('default');
    });

    // The style task which checks styling standards
    gulp.task('style', ['jshint', 'jscs']);

    // The default task (called when you run `gulp` from cli)
    gulp.task('default', ['jshint', 'jscs', 'test']);
})();