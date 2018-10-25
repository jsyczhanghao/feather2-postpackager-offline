{{#featherjs#}}
(function(){
    function relative(url){
        if(!/^\/[^\/]/.test(url)){
            return url;
        }

        var a = url.split('/');
        var b = window.__URL__.split('/');
        var l = [], i = 0;

        for(;i < b.length; i++){
            if(b[i] == a[i]){
                continue;
            }else{
                break;
            }
        }

        for(var j = i + 1; j < b.length; j++){
            l.push('..');
        }

        url = l.concat(a.slice(i)).join('/');
        return url;
    }

    var load = define.Module.load;
    define.Module.load = function(url, callback){
        return load(relative(url), callback);
    };

    var config = require.config;
    require.config = function(name, value){
        if(name == 'map' && value){
            var newMap = {};

            for(var i in value){
                newMap[relative(i)] = value[i];
            }

            value = newMap;
        }

        return config(name, value);
    };
})();