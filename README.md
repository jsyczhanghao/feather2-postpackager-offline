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