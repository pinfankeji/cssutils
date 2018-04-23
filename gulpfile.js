/**
 * Created at 2018/4/23 16:20
 * Author esinger (Weibo: http://weibo.com/esinger Wechat: esinger)
 * Copyright pinfankeji.com
 */


const gulp = require('gulp')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const minify = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')
const beautify = require('gulp-cssbeautify')

const moment = require('moment')
const del = require('del')
const replace = require('gulp-replace')

const scssDir = './src/scss'
const cssDir = './src/css'
const distDir = './dist'
const demoDir = './demo'

const scssFiles = scssDir + '/*.scss'
const cssFiles = cssDir + '/*.css'
const watchFiles = scssDir + '/**/*.scss'

const autoprefixerConfig = require('./config/autoprefixer')
const packageConfig = require('./package')

// 删除css文件
gulp.task('del:css', function (cb) {
    del([cssDir])
})

// 删除dist文件
gulp.task('del:dist', function (cb) {
    del([distDir])
})

// 处理SCSS
gulp.task('scss', function () {
    return gulp.src(scssFiles)
        .pipe(sass())
        .pipe(autoprefixer(autoprefixerConfig))
        .pipe(beautify())
        .pipe(gulp.dest(cssDir))
        .pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(cssDir))
})

// 监听SCSS变化
gulp.task('watch', function () {
    gulp.watch(watchFiles, ['scss'])
})

// 构建分发版本
gulp.task('build', function () {
    return gulp.src(cssFiles)
        .pipe(replace('{name}', packageConfig.name))
        .pipe(replace('{description}', packageConfig.description))
        .pipe(replace('{version}', packageConfig.version))
        .pipe(replace('{author}', packageConfig.author))
        .pipe(replace('{repository}', packageConfig.repository.url))
        .pipe(replace('{homepage}', packageConfig.homepage))
        .pipe(replace('{date}', moment().format('YYYY-MM-DD hh:mm:ss')))
        .pipe(gulp.dest(distDir))
})
