module.exports = function (grunt) {

  'use strict';

  var fileList = [
        'src/js/intro.js',
        'src/js/variables.js',
        'src/js/utilities.js',
        'src/js/cropper.js',
        'src/js/load.js',
        'src/js/build.js',
        'src/js/render.js',
        'src/js/preview.js',
        'src/js/listen.js',
        'src/js/handlers.js',
        'src/js/methods.js',
        'src/js/change.js',
        'src/js/prototype.js',
        'src/js/defaults.js',
        'src/js/template.js',
        'src/js/plugin.js',
        'src/js/outro.js'
      ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    today: grunt.template.today('yyyymmdd'),

    clean: {
      dist: ['dist'],
      cache: ['_caches/<%= pkg.version %>+<%= today %>'],
      release: ['_releases/<%= pkg.version %>'],
      docs: ['_gh_pages']
    },

    concat: {
      dist: {
        src: fileList,
        dest: 'dist/<%= pkg.name %>.js'
      },
      build: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/<%= pkg.name %>.js.map'
        },
        src: fileList,
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    jshint: {
      options: {
        jshintrc: 'src/.jshintrc'
      },
      main: [
        'Gruntfile.js',
        'dist/<%= pkg.name %>.js',
        'examples/*/js/main.js',
        'demos/js/main.js',
        'docs/js/main.js'
      ],
      test: ['tests/**/*.js']
    },

    jscs: {
      options: {
        config: 'src/.jscsrc'
      },
      main: [
        'Gruntfile.js',
        'dist/<%= pkg.name %>.js',
        'examples/*/js/main.js',
        'demos/js/main.js',
        'docs/js/main.js'
      ],
      test: ['tests/**/*.js']
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      docs: {
        src: 'docs/js/main.js',
        dest: '_gh_pages/js/main.js'
      }
    },

    less: {
      dist: {
        src: 'src/less/<%= pkg.name %>.less',
        dest: 'dist/<%= pkg.name %>.css'
      },
      build: {
        options: {
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/<%= pkg.name %>.css.map'
        },
        src: 'src/less/<%= pkg.name %>.less',
        dest: 'dist/<%= pkg.name %>.css'
      }
    },

    csslint: {
      options: {
        csslintrc: 'src/.csslintrc'
      },
      main: [
        'dist/<%= pkg.name %>.css',
        'demos/css/main.css',
        'docs/css/main.css',
        'tests/css/main.css'
      ]
    },

    autoprefixer: {
      options: {
        map: false,
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      dist: {
        src: 'dist/<%= pkg.name %>.css',
        dest: 'dist/<%= pkg.name %>.css'
      }
    },

    csscomb: {
      options: {
        config: 'src/.csscomb.json'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.css',
        dest: 'dist/<%= pkg.name %>.css'
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      dist: {
        src: 'dist/<%= pkg.name %>.css',
        dest: 'dist/<%= pkg.name %>.min.css'
      },
      docs: {
        src: 'docs/css/main.css',
        dest: '_gh_pages/css/main.css'
      }
    },

    replace: {
      options: {
        prefix: '@',
        patterns: [{
          match: 'VERSION',
          replacement: '<%= pkg.version %>'
        }, {
          match: 'YEAR',
          replacement: (new Date()).getFullYear()
        }, {
          match: 'DATE',
          replacement: (new Date()).toISOString()
        }]
      },
      dist: {
        expand: true,
        flatten: true,
        src: ['dist/*.js', 'dist/*.css'],
        dest: 'dist'
      }
    },

    htmlmin: {
      options: {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        collapseWhitespace: true
      },
      docs: {
        expand: true,
        flatten: true,
        src: 'docs/index.html',
        dest: '_gh_pages'
      }
    },

    validation: {
      all: ['docs/*.html', 'demos/*.html', 'examples/**/*.html']
    },

    qunit: {
      test: ['tests/**/*.html']
    },

    copy: {
      cache: {
        expand: true,
        flatten: true,
        src: 'dist/*',
        dest: '_caches/<%= pkg.version %>+<%= today %>'
      },
      release: {
        expand: true,
        flatten: true,
        src: 'dist/*',
        dest: '_releases/<%= pkg.version %>'
      },
      docs: {
        expand: true,
        cwd: 'docs',
        src: '**',
        dest: '_gh_pages'
      },
      sync: {
        files: [{
          expand: true,
          flatten: true,
          src: 'dist/*.css',
          dest: '_gh_pages/css'
        }, {
          expand: true,
          flatten: true,
          src: 'dist/*.js',
          dest: '_gh_pages/js'
        }, {
          expand: true,
          flatten: true,
          src: 'assets/img/*',
          dest: '_gh_pages/img'
        }]
      },
      update: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'bower_components',
          src: [
            'jquery/dist/jquery.min.js',
            'bootstrap/dist/js/bootstrap.min.js',
            'qunit/qunit/qunit.js'
          ],
          dest: 'assets/js'
        }, {
          expand: true,
          flatten: true,
          cwd: 'bower_components',
          src: [
            'bootstrap/dist/css/bootstrap.min.css',
            'qunit/qunit/qunit.css'
          ],
          dest: 'assets/css'
        }, {
          expand: true,
          flatten: true,
          cwd: 'bower_components',
          src: [
            'bootstrap/dist/fonts/*'
          ],
          dest: 'assets/fonts'
        }]
      }
    },

    watch: {
      js: {
        files: ['src/js/*.js'],
        tasks: 'concat:build'
      },
      css: {
        files: ['src/less/*.less'],
        tasks: 'less:build'
      },
      docs: {
        files: ['docs/**'],
        tasks: 'newer:copy:docs'
      }
    }
  });

  require('load-grunt-tasks')(grunt); // Loading dependencies

  grunt.registerTask('css', ['less:dist', 'csslint', 'autoprefixer', 'csscomb', 'cssmin:dist']);
  grunt.registerTask('js', ['concat:dist', 'jshint', 'jscs', 'uglify:dist']);
  grunt.registerTask('test', ['qunit']);
  grunt.registerTask('cache', ['clean:cache', 'copy:cache']);
  grunt.registerTask('release', ['clean:release', 'copy:release']);
  grunt.registerTask('docs', ['clean:docs', 'copy:docs', 'copy:sync', 'htmlmin', 'uglify:docs', 'cssmin:docs']);
  grunt.registerTask('default', ['clean:dist', 'js', 'css', 'test', 'replace', 'cache', 'release', 'docs']);
};
