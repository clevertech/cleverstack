'use strict';

module.exports = function( grunt ) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            docs: {
                files: ['src/**/*'],
                tasks: ['docular']
            },
            tests: {
                files: ['src/**/*', 'test/unit/**/*', 'test/integration/**/*'],
                tasks: ['mochaTest:ci']
            },
        },
        docular: {
            docular_webapp_target: '/docs',
            showDocularDocs: false,
            showAngularDocs: false,
            groups: [
                {
                    groupTitle: 'CleverStack Node Seed',
                    groupId: 'cleverstack',
                    groupIcon: 'icon-book',
                    sections: [
                        {
                            id: "controllers",
                            title: "Controllers",
                            docs: [
                                "docs-sections/controllers.doc"
                            ],
                            scripts: [
                                "src/controllers"
                            ]
                        },
                        {
                            id: "models",
                            title: "Models",
                            docs: [
                                "docs-sections/models.doc"
                            ],
                            scripts: [
                                "src/model"
                            ]
                        },
                        {
                            id: "services",
                            title: "Services",
                            docs: [
                                "docs-sections/services.doc"
                            ],
                            scripts: [
                                "src/service"
                            ]
                        },
                        {
                            id: "routes",
                            title: "Routes",
                            docs: [
                                "docs-sections/routes.doc"
                            ],
                            scripts: [
                                "routes.js"
                            ]
                        },
                        {
                            id: "utils",
                            title: "Utils",
                            docs: [
                                "docs-sections/utils.doc"
                            ],
                            scripts: [
                                "src/utils"
                            ]
                        },
                        {
                            id: "tasks",
                            title: "Tasks",
                            docs: [
                                "docs-sections/tasks.doc"
                            ],
                            scripts: [
                                "src/tasks"
                            ]
                        }
                    ]
                }
            ]
        },
        "docular-server": {
            port: 8888 //default is 8000
        },
        connect: {
            options: {
                port: 8888,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0'
            },
            docs: {
                options: {
                    base: __dirname+'/docs'
                }
            }
        },
        clean: {
            docs: 'docs'
        },
        nodemon: {
            web: {
                options: {
                    file: 'app.js',
                    ignoredFiles: ['README.md', 'node_modules/**', 'docs'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['src'],
                    delayTime: 1,
                    cwd: __dirname
                }
            }
        },
        mochaTest: {
            unit: {
                options: {
                    require: 'should',
                    reporter: 'spec'
                },
                src: ['test/server/unit/**/*.js']
            },
            e2e: {
                options: {
                    require: 'should',
                    reporter: 'spec'
                },
                src: ['test/server/integration/**/*.js']
            },
            ci: {
                options: {
                    require: 'should',
                    reporter: 'min'
                },
                src: ['test/server/integration/**/*.js', 'test/server/unit/**/*.js']
            }
        },
        concurrent: {
            servers: {
                tasks: ['server:web', 'server:docs', 'watch:docs'],
                options: {
                    logConcurrentOutput: true
                }
            },
        },
        exec: {
            rebase: {
                cmd: "node bin/rebase.js"
            },
            seed: {
                cmd: "node bin/seedModels.js"
            }
        }
    });

    grunt.registerTask('docs', ['clean:docs','docular']);

    grunt.registerTask('test', ['mochaTest:unit']);
    grunt.registerTask('test:unit', ['mochaTest:unit']);
    grunt.registerTask('test:e2e', ['mochaTest:e2e']);
    grunt.registerTask('test:ci', ['watch:tests']);

    grunt.registerTask('server', ['concurrent:servers']);
    grunt.registerTask('server:web', ['nodemon:web']);
    grunt.registerTask('server:docs', ['connect:docs', 'watch:docs']);

    grunt.registerTask('db:rebase', ['exec:rebase']);
    grunt.registerTask('db:seed', ['exec:seed']);

    grunt.registerTask('db', ['db:rebase', 'db:seed']);


    grunt.registerTask('default', ['server']);
};
