module.exports = function (grunt)
{
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-injector');

    var serveStatic = require('serve-static');
    var appConfig = {app: "app"};

    // Project configuration.
    grunt.initConfig({
        bower: grunt.file.readJSON('bower.json'),
        project: appConfig,
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect)
                    {
                        return [
                            serveStatic('.tmp'),
                            connect().use(
                                    '/bower_components',
                                    serveStatic('./bower_components')
                            ),
                            serveStatic(appConfig.app)
                        ];
                    }
                }
            },
        },
        //HTML file local injections
        injector: {
            options: {
                relative: false,
                ignorePath: "app/",
            },
            local_dependencies: {
                files: {
                    'app/index.html': ['app/**/*.js', 'app/**/*.css'],
                }
            }
        },
        //HTML file bower injections
        wiredep: {

            task: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'app/*.html',   // .html support...
                    'app/views/**/*.html',   // .html support...
                    'app/config.yml'         // and .yml & .yaml support out of the box!
                ],

                options: {
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        },
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= project.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:eslint'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            styles: {
                files: ['<%= project.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= project.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= project.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
    });

    // Default task(s).
    grunt.registerTask('default', [
//         'clean:server',
        'wiredep',
        'injector',
        'connect:livereload',
        'watch']);

};