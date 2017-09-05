# feather2-postpackager-offline

feather2的资源离线方案，可以用于app下的离线html等hybrid应用。

### 使用

```sh
npm install feather2-postpackager-offline
```

```js
//conf.js
feather.config.get('postpackager').push('offline');
```

本地预览，注：本地预览时，url仍为localhost，可方便使用本地的一些数据mock

```sh
feather2 release
```

正式编译时，则需要将static和view的代码放在同一个目录

```js
//conf/deploy/xxx.js 配置文件
module.exports = [
    {
        from: '/view',
        to: '../dist/',  //view和static需要同一目录
        subOnly: true
    },

    {
        from: '/static',
        to: '../dist/',  //view和static需要同一目录
        subOnly: true
    }
];
```

```sh
feather2 release -d xxx
```

注：js中引用图片时尽量不要使用__uri语法，而采用__inline转换为base64，原因因如果使用__uri后，js文件可能会被多个html文件引用，造成无法准确使用相对路径进行定位

```js
var img = new Image();
img.src = __inline('./1.png'); //不要使用__uri('./1.png')
document.body.appendChild(img);
```
