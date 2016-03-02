module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');

	fs = require('fs');

	var htmldir = 'dev/html/';

	var results = fs.readdirSync(htmldir),
	    pages   = [];

	for( var i = 0; i < results.length; i++ ){
		var entry = results[i];
		var stats = fs.statSync(htmldir + entry);
		if(entry.substring(0,1) != '.' && stats.isDirectory()){
			pages.push(entry);
		}
	}

	console.log('Found '+pages.length+' page'+(pages.length != 1 ? 's' : '')+':');
	for(i = 0; i < pages.length; i++){
		console.log('- ' + pages[i]);
	}
	var concatFilesDev = [];
	var concatFilesDeploy = [];
	for(i = 0; i < pages.length; i++){
		var path = htmldir+pages[i]+'/';
		var header = path+'header.html';
		var footer = path+'footer.html';

		//determine if a local header.html exists.  If not, use global header.html
		try {
			stats = fs.lstatSync(header);
		}
		catch(e) {
			header = htmldir+'header.html';

			try {
				stats = fs.lstatSync(header);
			}
			catch(e) {
				header = '';
			}
		}

		//determine if a local footer.html exists.  If not, use global footer.html
		try {
			stats = fs.lstatSync(footer);
		}
		catch(e) {
			footer = htmldir+'footer.html';

			try {
				stats = fs.lstatSync(footer);
			}
			catch(e) {
				footer = '';
			}
		}

		concatFilesDev.push({
			src: [header, path+'component*.html', path+'devscripts.html', footer],
			dest: 'build/'+pages[i]+'.html'
		});
		concatFilesDeploy.push({
			src: [header, path+'component*.html', footer],
			dest: 'live/'+pages[i]+'.html'
		});
	}

	var concatObj = {
		options: {
			separator: '\r\n'
		},
		build: {
			files: [
				concatFilesDev
			]
		},
		deploy: {
			files: [
				concatFilesDeploy
			]
		}
	};

	grunt.initConfig({
		uglify: {
			build: {
				files: {
					'build/js/script.js': ['dev/js/*.js']
				} //files
			}, //build
			deploy: {
				files: {
					'live/js/script.js': ['dev/js/*.js']
				} //files
			} //deploy
		}, //uglify
		compass: {
			build: {
				options: {
					config: 'compass_dev.rb'
				} //options
			}, //dev
			deploy: {
				options: {
					config: 'compass_deploy.rb'
				} //options
			} //deploy
		}, //compass
		copy: {
			build: {
				files: [
					{expand:true, cwd: 'dev/', src:['images/*.*'], dest: 'build/', filter: 'isFile'},
					{expand:true, cwd: 'dev/', src:['js/lib/*.js'], dest: 'build/', filter: 'isFile'},
					{expand:true, cwd: 'dev/', src:['css/**'], dest: 'build/'},
					{expand:true, cwd: 'dev/', flatten: true, src:['html/*.html'], dest: 'build/', filter: 'isFile'}
				]
			},
			deploy: {
				files: [
					//{expand:true, cwd: 'dev/', src:['*.html'], dest: 'live/', filter: 'isFile'},
					{expand:true, cwd: 'dev/', src:['js/lib/*.js'], dest: 'live/', filter: 'isFile'},
					{expand:true, cwd: 'dev/', src:['css/**'], dest: 'live/'},
					{expand:true, cwd: 'dev/', src:['images/*.*'], dest: 'live/', filter: 'isFile'},
					{expand:true, cwd: 'dev/', flatten: true, src:['html/*.html'], dest: 'live/', filter: 'isFile'}
				] //files
			}, //deploy
			pages: {
				files: [
					{expand:true, cwd: 'dev/', flatten: true, src:['html/*.html'], dest: 'build/', filter: 'isFile'}
				]
			}
		}, //copy

		concat: concatObj,

		watch: {
			options: {
				livereload: true
			}, //options
			scripts: {
				files: ['dev/js/*.js'],
				tasks: ['uglify:build']
			}, //scripts
			sass: {
				files: ['dev/sass/*.scss'],
				tasks: ['compass:build']
			}, //sass
			html: {
				files: ['dev/html/*.html'],
				tasks: ['copy:pages', 'concat:build']
			}, //htmltemplates
			htmltemplates: {
				files: ['dev/html/*/*.html'],
				tasks: ['concat:build']
			} //htmltemplates
		} //watch
	}); //initConfig
	grunt.registerTask('default', 'watch');
	grunt.registerTask('deploy', ['uglify:deploy', 'compass:deploy', 'concat:deploy', 'copy:deploy']);
	grunt.registerTask('build', ['uglify:build', 'compass:build', 'concat:build', 'copy:build']);
} //exports
