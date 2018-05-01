/**
 * Created at 2018/4/23 16:20
 * Author esinger (Weibo: http://weibo.com/esinger Wechat: esinger)
 * Copyright pinfankeji.com
 */


const gulp = require('gulp')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const minify = require('gulp-clean-css')
const prefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')
const beautify = require('gulp-cssbeautify')

const browserSync = require('browser-sync').create()
const reload = browserSync.reload

const moment = require('moment')
const del = require('del')
const replace = require('gulp-replace')

const scssDir = './src/scss'
const devDir = './dev'
const cssDir = devDir + '/css'
const distDir = './dist'

const scssFiles = scssDir + '/*.scss'
const devFiles = devDir + '/**/*.*'
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

// 编译SCSS
gulp.task('compile', function () {
    return gulp.src(scssFiles)
        .pipe(sass())
        .pipe(prefixer(autoprefixerConfig))
        .pipe(beautify())
        .pipe(gulp.dest(cssDir))
})

// 监视SCSS并自动编译
gulp.task('watch', function () {
    gulp.watch(watchFiles, ['compile'])
})

// 启动服务器
gulp.task('server', function () {

    browserSync.init({
        server: {
            baseDir: devDir
        }
    })

    gulp.watch(watchFiles, ['compile'])
    gulp.watch(devFiles).on('change', reload)
})

// 构建分发版本
gulp.task('build', function () {
    return gulp.src(scssFiles)
        .pipe(sass())
        .pipe(prefixer(autoprefixerConfig))
        .pipe(beautify())
        .pipe(replace('{name}', packageConfig.name))
        .pipe(replace('{description}', packageConfig.description))
        .pipe(replace('{version}', packageConfig.version))
        .pipe(replace('{author}', packageConfig.author))
        .pipe(replace('{repository}', packageConfig.repository.url))
        .pipe(replace('{homepage}', packageConfig.homepage))
        .pipe(replace('{date}', moment().format('YYYY-MM-DD hh:mm:ss')))
        .pipe(gulp.dest(distDir))
        .pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(distDir))
})
