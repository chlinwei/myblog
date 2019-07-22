layui.define(['jquery'],function(exports){
    var $ = layui.$;
    var lw_obj = {
        getUrlParam:function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI (r[2]); return null;
        }
    };
    exports('lwUtil',lw_obj);
});
