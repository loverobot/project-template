const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const $ = require('gulp-load-plugins')();//����package.json �ڰ����Ĳ��
const wiredep = require('wiredep').stream;//bower д��html
const fileinclude = require('./fileinclude.json'); //fileInclude ���������ļ�
const lazypipe = require('lazypipe');
const pngquant = require('imagemin-pngquant');
const stylish = require('jshint-stylish');
const devDir = '.dev';//�����ļ���
const buildDir = '.build';
const dist = 'dist';
const port = 3001;
//JS hint task
var config = {
   htmlPath : null,
   jsPath:null,
   cssPath:null,
   imgPath: null,
   sassPath: null
}
//��ȡ�ļ�·��
function getDir(path){
   var arr = path.split('\\');
   var l = arr.length -2;
   var file = arr[arr.length-1].indexOf('.scss');
   console.log(file);
   if(file > 0){
     return arr[l];
   }else{
     return '';
   }
}
//bower��Դ����
gulp.task('wiredep', function(){
    return gulp.src('app/modle/bower/*.html')
        .pipe(wiredep({
            exclude: [],
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app/modle/bower'));
});

//Html�ļ�����
gulp.task('compileHtml',['wiredep'],function(){
   var file = config.htmlPath ? config.htmlPath : 'app/pages/*.html';
   return gulp.src(file)
	   .pipe($.changed(devDir, {//��⿪��dev�ļ�����html�ı任
            extension: '.html',
            hasChanged: $.changed.compareSha1Digest
        }))
		.pipe($.fileInclude(fileinclude.set))//���ݹ���Ƕ��html�ļ� gulp-file-include htmlҳ��<!--@@ include("**/*.html") -->�滻��Ӧ��htmlƬ��
		.pipe(gulp.dest(devDir+"/pages"))
		.pipe(reload({ stream: true }));
});
//js��ʽУ��
gulp.task('jshint', function() {
	var file = config.jsPath ? config.jsPath : ['app/src/js/**/*.js','app/modle/**/*.js'];
    return gulp.src(file)
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish))//ƥ��У�����
        .pipe(reload({ stream: true }));
});
//sass�ļ�����
gulp.task('sass', function() {
	var file = config.sassPath ? config.sassPath : 'app/src/sass/**/*.scss';
    var dir = 'app/src/css/';
    return gulp.src(file)
        .pipe($.sass().on('error', $.sass.logError))
		.pipe($.autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(gulp.dest(dir));
});
//�����ļ���ʼ
gulp.task('dev',['compileHtml']);

gulp.task('server',['dev'],function(){
  const routes = require('./app/config/route.json');
  browserSync.init({
        "port": port,
        "notify": false,
        "scrollProportionally": false,
        "server": {
            "baseDir": [devDir, devDir +'/pages', devDir +'/demo', 'app'],
            "index": "index.html",
            "routes": routes
        }
    });
	//1.html�ļ��仯
    gulp.watch('app/modle/**/*.html', function(event){
        config.htmlPath = 'app/pages/**/*.html';
        gulp.start('compileHtml');
    });

    gulp.watch('app/pages/**/*.html', function(event){
        config.htmlPath = event.path;
        gulp.start('compileHtml');
    });

    gulp.watch('app/demo/**/*.html', function(event){
        config.htmlPath = event.path;
        gulp.start('compileHtml');
    });

    //2.modules svg�ļ��仯
    //gulp.watch('app/modules/**/**.svg', ['svgModules']);

    //3.static svg�ļ��仯
    //gulp.watch('app/static/svgs/**/**.svg', ['svgStatic']);

    //4.js�ļ��Ĵ���
    gulp.watch('app/**/**.js', function(event){
        config.jsPath = event.path;
        gulp.start('jshint');
    });
    
	gulp.watch('app/src/sass/**/**.scss',function(event){
	   config.sassPath = event.path;
	   gulp.start('sass');
	});
    //5.������Դ����
    gulp.watch(['app/**/**.{jpg,jpeg,png,gif,json,css}'], reload);
});

gulp.task('ds',['server']);

//--------------------------���start------------------------------------------------
//������Դ
gulp.task('useref',function(){
   return gulp.src(['app/pages/*.html','app/modle/**/*.html'],{ base: 'app' })
	   .pipe($.changed(buildDir,{
          extension: '.html',
           hasChanged: $.changed.compareSha1Digest
       }))
	   //.pipe($.useref({searchPath: './app'}))
	   .pipe($.useref({searchPath: './app'}, lazypipe().pipe($.sourcemaps.init, { loadMaps: true })))
       .pipe($.sourcemaps.write('maps'))
	   .pipe(gulp.dest(buildDir));
});
//������̬�����ļ�
gulp.task('copy_img_font_routes', function(){
    return gulp.src([
        'app/data/**/*.*',
		'app/config/**/*.*',
        'app/src/fonts/*.{otf,svg,eot,ttf,woff,woff2}',
        'app/src/img/**/*.{gif,png,jpg,jpeg}'
        ], { base: 'app' })
        .pipe(gulp.dest(buildDir))
});
//����jsѹ���ļ���map�ļ�
gulp.task('compress',['useref','copy_img_font_routes'],function(){
   return gulp.src([buildDir+'/src/js/*.js',buildDir+'/src/css/*.css',buildDir+'/src/img/*.{gif,png,jpg,jpeg}'],{base:buildDir})
	   .pipe($.rev())
	   .pipe($.if('*.jpg'||'*.jpeg'||'*.gif'||'*.png',
	      $.imagemin({
            progressive: true,
            use: [pngquant()]
          })
	   ))
	   .pipe($.if('*.js', $.uglify()))
       .pipe($.if('*.css', $.cleanCss()))
	   .pipe(gulp.dest(buildDir))
	   .pipe($.rev.manifest())
	   .pipe(gulp.dest(buildDir)) 
});

var deleteFolder = module.exports.deleteFolder= function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
//ɾ���ļ��м��ļ�������
gulp.task('del',function(){
  return deleteFolder(buildDir);
})
//������
gulp.task('build',['compress'],function(){
   return gulp.src(buildDir+'/pages/*.html',{ base: buildDir })
	   .pipe($.fileInclude(fileinclude.set)) //�滻���Ϻ��html��Դ
	   .pipe(gulp.dest(buildDir));
});
gulp.task('bs',['build'],function(){
  const routes = require('./'+buildDir+'/config/route.json');
  browserSync.init({
        "port": port,
        "notify": false,
        "scrollProportionally": false,
        "server": {
            "baseDir": [buildDir, buildDir +'/pages', buildDir +'/demo', buildDir],
            "index": "index.html",
            "routes": routes
        }
    });
})

//-----------------------publish--------------------------------------------
gulp.task('publishHtml', function(){
    return gulp.src([
		buildDir+'/src/fonts/*.{otf,svg,eot,ttf,woff,woff2}',
		buildDir+'/src/**/*-*.*'
	    ], { base: buildDir })
        .pipe(gulp.dest(dist))
});
gulp.task('rev',['publishHtml'], function () {
    return gulp.src([buildDir+'/*.json', buildDir+'/pages/*.html'])
        .pipe( $.revCollector({replaceReved: true}) )
        .pipe( $.minifyHtml({
                empty:true,
                spare:true
            }) )
        .pipe( gulp.dest(dist) );
});

gulp.task('publish',['rev']);

gulp.task('ps',['publish'],function(){
  browserSync.init({
        "port": port,
        "notify": false,
        "scrollProportionally": false,
        "server": {
            "baseDir": [dist],
            "index": "index.html",
        }
    });
})