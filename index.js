'use strict';

var path = require('path');
var merge = feather.util.merge;
var pkgs;
var M_PREFIX = feather.config.get('statics') + '/m_/';

function is_M(url){
    return url.indexOf(M_PREFIX) === 0;
}

function replaceMapFile(fileUrl, url){
    var file;

    for(var i in pkgs){
        file = pkgs[i];

        if(file.getUrl() === url){
            break;
        }
    }

    var obj = (new Function('var require = {config: function(obj){return obj}}; return ' + file.getContent()))();
    var map = obj.map || {};
    var newMap = {};

    for(var i in map){
        newMap[relative(fileUrl, i)] = map[i];
    }

    obj.map = newMap;
    file.setContent('require.config(' + JSON.stringify(obj) + ');');
}

function relative(u1, u2){
    if(u2[0] == '/'){
        return path.relative(path.dirname(u1), u2).replace(/\\/g, '/');
    }

    return u2;
}

function replaceCss(fileUrl, content){
    return content.replace(/\b((?:url|src)\(['"]?)([^'"\)]+)/g, function(all, prefix, url){
        return prefix + relative(fileUrl, url);
    });
}

function replaceHtml(fileUrl, content){
    return content.replace(/(<style[^>]*>)([\s\S]+?)<\/style>/g, function(all, start, url){
        return start + replaceCss(fileUrl, url) + '</style>';
    }).replace(/(<[^>]+?(?:(?:data-)?href|src)=['"])([^'"]+)/g, function(all, start, url){
        if(is_M(url)){
            replaceMapFile(fileUrl, url);
        }

        return start + relative(fileUrl, url);
    }).replace(/<head[^>]*>/, function(all){
        return all + '<script>window.__URL__ = "' + fileUrl + '";</script>';
    });
}

module.exports = function(ret){
    pkgs = ret.pkg;

    feather.util.map(merge(merge({}, ret.src), ret.pkg), function(subpath, file){
        var content = file.getContent();

        if(file.isCssLike){
            content = replaceCss(file.getUrl(), content);
            file.setContent(content);
        }else if(file.isHtmlLike){
            content = replaceHtml(file.subpath, content);
            file.setContent(content);
        }
    });

    if(feather.config.get('cli').watch){
        var fjs = ret.pkg['/static/feather.js'];
        var content = fjs.getContent();
        var tpl = feather.util.read(__dirname + '/js.tpl');
        content = tpl.replace('{{#featherjs#}}', content);
        fjs.setContent(content);
    }
};