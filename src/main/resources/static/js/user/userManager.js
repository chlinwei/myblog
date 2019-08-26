layui.use(['table','article','form','lwUtil','jquery'],function () {
    var $ = layui.$;
    var table = layui.table;
    var articleMod = layui.article;
    var form = layui.form;
    var lwUtil = layui.lwUtil;
    var requestUrl = contextPath + "/getDraftList";
    table.render({
        elem:'#table',
        url:requestUrl,
        page:true,
        cols:[[
            {type: 'checkbox', fixed: 'left',field:'id',width:'10%'},
            {field: 'articleTitle', title: '标题',  sort: false, fixed: 'left',width:'55%',templet: function (d) {
                var articleTitle = d.articleTitle;
                var href = contextPath + '/draft/' + d.id;
                return "<a class='layui-table-link' href="+href+">"+articleTitle+"</a>";
            }},
            {field: 'updateTime', title: '保存日期',  sort: true, fixed: 'left',width:'20%'},
            {fixed: 'right', title:'操作', toolbar: '#opt'}
        ]],
        method:'get',
        request:{
            limitName:'pageSize',
            pageName:'pageNum'
        },
        id:"idTest",
        where:{
            //请求参数
            // 'customTypeId':1
        },
        parseData:function (res) {
            return {
                "code":res.code,
                "msg":res.msg,
                "count":res.data.total,
                "data":res.data.list
            };
        }
    });
    function getIds() {
        var checkStatus = table.checkStatus('idTest');
        var list = checkStatus.data;
        var ids = [];
        for(var i=0;i<list.length;i++){
            ids.push(list[i].id);
        }
        return ids;
    }
    table.on('tool(table)', function(obj){
        if(obj.event=="edit"){
            window.open(contextPath+"/draft/" + obj.data.id);
        }else if(obj.event="del"){
            var id = obj.data.id;
            layer.confirm("确定要删除？",function (index) {
                articleMod.delDraftById(id,function (data) {
                    layer.close(index);
                    if(data.code===0){
                        obj.del();
                    }else if(data.code===403){
                        window.location.replace(contextPath+"/login");
                    }else{
                        layer.alert("删除失败！");
                    }
                });
            })
        }
    });

    $(".removeBtn").click(function () {
        var ids = getIds();
        if(ids.length===0){
            layer.msg("请选择要删除的草稿！");
        }else{
            layer.confirm("确定删除文章？",function (index) {
                layer.close(index);
                articleMod.delDrafts(ids,function (data) {
                    if(data.code===0){
                        window.location.reload();
                    }else if(data.code===403){
                        window.location.replace(contextPath+"/login");
                    }else{
                        layer.alert("删除草稿失败！");
                    }
                });
            });
        }
    });

});
