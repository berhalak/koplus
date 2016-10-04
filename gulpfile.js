var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var minify = require('gulp-minify');
var clean = require('gulp-clean');
 
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task("compile", ['clean'], function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task("build", ['compile'], function () {
    return gulp.src('dist/koplus.js')
	    .pipe(minify({
	        ext:{
	            min:'.min.js'
	        },
	        ignoreFiles: ['.min.js']
	    }))
	    .pipe(gulp.dest('dist'))
});