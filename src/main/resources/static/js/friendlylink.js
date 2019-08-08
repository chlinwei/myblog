layui.use(['jquery','comment','article','form','lwUtil','laypage'],function () {
    var $ = layui.$;
    var layer = layui.layer;

    /**
     * 获取所有友情链接
     */
    function getLinks(callback) {
        $.ajax({
            type:'get',
            url:contextPath+"/getFriendlylinks",
            data:{},
            success:function (data) {
                if(callback){
                    callback(data);
                }
            },
            error:function () {
                layer.alert("获取友情链接失败！");
            }
        })
    }
    function getlinksDone(data) {
        if(data.code===0){
            var list =data.data;
            var linkList = $(".friendlylinks .linkList");
            var html = "";
            for(var i=0;i<list.length;i++){
                html += "<div class='link'><a target='_blank' href="+list[i].url+" >"+list[i].name+"</a></div>";
            }
            linkList.append(html);
        }else{
            layer.alert("获取友情链接失败！");
        }
    }
    getLinks(getlinksDone);
});
