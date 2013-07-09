'use strict';

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            gruntfile: 'Gruntfile.js',
            src: 'src/**/*.js',
            test: 'test/**/*.js',
            all: ['Gruntfile.js', 'src/**/*', 'test/**/*']
        },
        simplemocha: {
            options: {
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },
            all: {
                src: '<%= meta.test %>'
            }
        },
        jshint: {
            src: {
                files: { src: '<%= meta.src %>' },
                options: {
                    node: true,
                    globalstrict: true
                }
            },
            test: {
                files: { src: '<%= meta.test %>' },
                options: {
                    node: true,
                    globalstrict: true,
                    expr: true, // to allow the use of expet(val).to.be.empty
                    globals: {
                        describe: false,
                        beforeEach: false,
                        it: false
                    }
                }
            },
            gruntfile: {
                files: { src: '<%= meta.gruntfile %>' },
                options: {
                    node: true,
                    globalstrict: true
                }
            },
            options: {
                bitwise: true,
                boss: true,
                curly: true,
                camelcase: true,
                eqeqeq: true,
                eqnull: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                maxcomplexity: 4,
                maxdepth: 3,
                maxparams: 4,
                maxstatements: 20,
                maxlen: 120,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: 'single',
                sub: true,
                strict: true,
                trailing: true,
                undef: true,
                unused: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'simplemocha']);
    grunt.registerTask(
        'travis',
        ['jshint', 'simplemocha']);
};
