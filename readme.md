# 使用说明
     npm install
     npm install gulp
     npm install bower
     bower install
     命令行使用说明
     gulp ds 等于 gulp server 开发环境
     gulp bs 等于 gulp build  打包入口
     gulp ps 等于 gulp publish  封板部署
####
## 目录

     |--app  //souce code
        |--pages
        |--modle
        |--src
        |--plugins  //bower 插件安装于此处
        |--config
        |--data
     |--.dev //development
        |--pages
     |--.build //打包
        |--config
        |--data
        |--modle
        |--pages
        |--src
           |--css
           |--img
           |--js
     |--dist   //上线
     |--package.json //npm依赖配置信息
     |--gulp.js  //gulp程序控制流程
     |--bower.json //bower配置文件
     |--.bowerrc //控制bower下载插件存放位置配置信息
     |--fileinclude.json //gulp-file-include 规则存放文件
     |--.gitignore //git上传屏蔽文件
     |--.gitattributes
     |--LICENSE //版权信息
     |--.editorconfig //IDE编辑器配置
