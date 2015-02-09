module.exports = function (grunt) {

  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    banner: "/*!\n" +
            " * Cropper v<%= pkg.version %>\n" +
            " * <%= pkg.homepage %>\n" +
            " *\n" +
            " * Copyright 2014-<%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
            " * Released under the <%= pkg.license.type %> license\n" +
            " */\n",
    clean: {
      dist: ["dist/"],
      build: ["build/<%= pkg.version %>.<%= grunt.template.today('yyyymmdd') %>"],
      release: ["releases/<%= pkg.version %>"],
      docs: ["docs/dist"]
    },
    jshint: {
      options: {
        jshintrc: "resources/.jshintrc"
      },
      files: ["*.js", "src/*.js", "docs/js/docs.js", "demos/js/docs.js"]
    },
    jscs: {
      options: {
        config: "resources/.jscsrc"
      },
      files: ["src/*.js", "docs/js/docs.js", "demos/js/docs.js"]
    },
    uglify: {
      dist: {
        src: "src/<%= pkg.name %>.js",
        dest: "dist/<%= pkg.name %>.min.js"
      }
    },
    autoprefixer: {
      options: {
        browsers: [
          "Android 2.3",
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24", // Firefox 24 is the latest ESR
          "Explorer >= 8",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6"
        ]
      },
      core: {
        options: {
          map: false
        },
        src: "dist/<%= pkg.name %>.css",
        dest: "dist/<%= pkg.name %>.css"
      }
    },
    csscomb: {
      options: {
        config: "resources/.csscomb.json"
      },
      core: {
        src: "dist/<%= pkg.name %>.css",
        dest: "dist/<%= pkg.name %>.css"
      }
    },
    csslint: {
      options: {
        csslintrc: "resources/.csslintrc"
      },
      files: ["src/*.css", "docs/css/docs.css", "demos/css/docs.css"]
    },
    cssmin: {
      options: {
        compatibility: "ie8",
        keepSpecialComments: "*",
        noAdvanced: true
      },
      dist: {
        src: "src/<%= pkg.name %>.css",
        dest: "dist/<%= pkg.name %>.min.css"
      }
    },
    htmlcomb: {
      demos: {
        src: "demos/index.html",
        dest: "demos/index.html"
      },
      docs: {
        src: "docs/index.html",
        dest: "docs/index.html"
      },
      examples: {
        src: "examples/crop-avatar/crop-avatar.html",
        dest: "examples/crop-avatar/crop-avatar.html"
      }
    },
    usebanner: {
      options: {
        position: "top",
        banner: "<%= banner %>"
      },
      files: ["dist/*.js", "dist/*.css"]
    },
    copy: {
      dist: {
        expand: true,
        cwd: "src/",
        src: "**",
        dest: "dist/",
        filter: "isFile"
      },
      build: {
        expand: true,
        cwd: "dist/",
        src: "**",
        dest: "build/<%= pkg.version %>.<%= grunt.template.today('yyyymmdd') %>/",
        filter: "isFile"
      },
      release: {
        expand: true,
        cwd: "dist/",
        src: "**",
        dest: "releases/<%= pkg.version %>/",
        filter: "isFile"
      },
      docs: {
        expand: true,
        cwd: "dist/",
        src: "**",
        dest: "docs/dist",
        filter: "isFile"
      }
    },
    watch: {
      files: [
        "src/<%= pkg.name %>.js",
        "src/<%= pkg.name %>.css"
      ],
      tasks: "default"
    }
  });

  // Loading dependencies
  require("load-grunt-tasks")(grunt);

  grunt.registerTask("build", ["clean:build", "copy:build"]);
  grunt.registerTask("release", ["clean:release", "copy:release"]);
  grunt.registerTask("docs", ["clean:docs", "copy:docs"]);
  grunt.registerTask("default", ["clean:dist", "jshint", "jscs", "uglify", "copy:dist", "autoprefixer", "csscomb", "csslint", "cssmin", "htmlcomb", "usebanner", "build", "release", "docs"]);
};
