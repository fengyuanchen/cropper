module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    banner: "/*!\n" +
            " * Cropper v<%= pkg.version %>\n" +
            " * <%= pkg.homepage %>\n" +
            " *\n" +
            " * Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
            " * Released under the <%= pkg.license.type %> license\n" +
            " */\n",
    clean: {
      dist: ["dist/"],
      build: ["build/<%= pkg.version %>.<%= grunt.template.today('yyyymmdd') %>"],
      release: ["release/<%= pkg.version %>"],
      docs: ["../fengyuanchen.github.io/<%= pkg.name %>/"]
    },
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      files: ["*.js", "src/*.js", "i18n/*.js"]
    },
    uglify: {
      dist: {
        src: "src/<%= pkg.name %>.js",
        dest: "dist/<%= pkg.name %>.min.js"
      }
    },
    autoprefixer: {
      options: {
        browsers: ["last 2 versions", "ie 8", "ie 9", "android 2.3", "android 4", "opera 12"]
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
        config: ".csscomb.json"
      },
      core: {
        src: "dist/<%= pkg.name %>.css",
        dest: "dist/<%= pkg.name %>.css"
      }
    },
    csslint: {
      options: {
        csslintrc: ".csslintrc"
      },
      files: ["src/*.css"]
    },
    cssmin: {
      dist: {
        src: "src/<%= pkg.name %>.css",
        dest: "dist/<%= pkg.name %>.min.css"
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
        dest: "release/<%= pkg.version %>/",
        filter: "isFile"
      },
      sync: {
        expand: true,
        cwd: "dist/",
        src: "**",
        dest: "../fengyuanchen.github.io/dist/",
        filter: "isFile"
      },
      docs: {
        expand: true,
        cwd: "docs/",
        src: "**",
        dest: "../fengyuanchen.github.io/<%= pkg.name %>/",
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

  grunt.registerTask("release", ["clean:release", "copy:release"]);
  grunt.registerTask("docs", ["clean:docs", "copy:sync", "copy:docs"]);
  grunt.registerTask("default", ["clean:dist", "clean:build", "jshint", "uglify", "copy:dist", "autoprefixer", "csscomb", "csslint", "cssmin", "usebanner", "copy:build"]);
};
