module.exports = function(grunt) {

	"use strict";

	var pkg = grunt.file.readJSON("package.json"),
		key;

	grunt.initConfig({
		pkg: pkg,
		name: pkg.name.toLowerCase(),
		banner: "/*! <%= pkg.name %> v<%= pkg.version %> | (c) 2014 <%= pkg.author %> */",
		clean: ["dist", "build/<%= pkg.version %>"],
		jshint: {
			options: {
				jshintrc: ".jshintrc"
			},
			files: [
				"Gruntfile.js",
				"<%= name %>.js"
			]
		},
		uglify: {
			options: {
				banner: "<%= banner %>\n"
			},
			build: {
				src: "<%= name %>.js",
				dest: "<%= name %>.min.js"
			}
		},
		csslint: {
			options: {
				csslintrc: ".csslintrc"
			},
			files: ["<%= name %>.css"]
		},
		cssmin: {
			options: {
				banner: "<%= banner %>"
			},
			main: {
				src: "<%= name %>.css",
				dest: "<%= name %>.min.css"
			}
		},
		copy: {
			main: {
				src: "<%= name %>*",
				dest: "build/<%= pkg.version %>/"
			}
		},
		watch: {
			files: [
				"*.js",
				"*.css"
			],
			tasks: "default"
		}
	});

	// Loading dependencies
	for (key in pkg.devDependencies) {
		if (key !== "grunt" && key.indexOf("grunt") === 0) {
			grunt.loadNpmTasks(key);
		}
	}

	grunt.registerTask("default", ["clean", "jshint", "uglify", "csslint", "cssmin", "copy"]);
};