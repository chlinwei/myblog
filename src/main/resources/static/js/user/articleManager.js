layui.use(['table','article','form','lwUtil','jquery'],function () {
    var $ = layui.$;
    var table = layui.table;
    var articleMod = layui.article;
    var form = layui.form;
    var lwUtil = layui.lwUtil;


    var requestUrl = contextPath + "/getArticlesInManager";
    var customTypeId = lwUtil.getUrlParam("customTypeId");
    var articleType = lwUtil.getUrlParam("articleType");
    if(customTypeId!==null &&customTypeId!=="0"){
        requestUrl += "?customTypeId=" + customTypeId;
        if(articleType!==null && articleType!=="0"){
            requestUrl += "&articleType=" + articleType;
        }
    }else{
        if(articleType!==null && articleType!=="0"){
            requestUrl += "?articleType=" + articleType;
        }
    }

    table.render({
        elem:'#table',
        url:requestUrl,
        page:true,
        cols:[[
            {type: 'checkbox', fixed: 'left',field:'id',width:'10%'},
            {field: 'articleTitle', title: '标题',  sort: false, fixed: 'left',width:'25%',templet: function (d) {
                var articleTitle = d.articleTitle;
                var href = contextPath + '/article/' + d.id;
                return "<a class='layui-table-link' href="+href+">"+articleTitle+"</a>";
            }},
            {field: 'articleType', title: '类型',  sort: false,width:'10%', fixed: 'left',templet:function (d) {
                var result = '未知';
                if(d.articleType===1){
                    result = '原创';
                }else if(d.articleType===2){
                    result = '转载';
                }
                return result;
            }},
            {field: 'customTypeName', title: '分类',  sort: false, fixed: 'left',width:'20%',templet:function (d) {
                if(d.customTypeId){
                    return d.customTypeName;
                }else{
                    return "<span style='color:#F581B1;'>未分类</span>";
                }
            }},
            {field: 'createTime', title: '发布日期',  sort: true, fixed: 'left',width:'20%'},
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
    form.on('submit(removeBtn)',function (data) {
        var ids = getIds();
        if(ids.length===0){
            layer.msg("请选择要删除的文章！");
        }else{
            layer.confirm("确定删除？",function (index) {
                layer.close(index);
                articleMod.delArticles(ids,function (data) {
                    if(data.code===0){
                        window.location.reload();
                    }else if(data.code===403){
                        window.location.replace(contextPath+"/login");
                    }else{
                        layer.alert("删除失败！");
                    }
                });
            });
        }
        return false;
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

    form.on('select(customTypeId)', function(data){
        var ids = getIds();
        if(ids.length===0){
            layer.msg("请选择要移动的文章！");
        }else{
            if(data.value===""){
                layer.msg("请选择分类！");
            }else{
                layer.confirm("确定移动文章？",function (index) {
                    layer.close(index);
                    articleMod.updateArticlesCustomType(ids,parseInt(data.value),function (data) {
                        if(data.code===0){
                            window.location.reload();
                        }else if(data.code===403){
                            window.location.replace(contextPath+"/login");
                        }else{
                            layer.alert("修改文章分类失败！");
                        }
                    });
                });
            }
        }
    });
    table.on('tool(table)', function(obj){
        if(obj.event=="edit"){
            window.open(contextPath+"/update/" + obj.data.id);
        }else if(obj.event="del"){
            var id = obj.data.id;
            layer.confirm("确定要删除？",function (index) {
                articleMod.delArticleById(id,function (data) {
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
    articleMod.getCustomTypes(function (data) {
        articleMod.getCustomTypesDone(data,function () {
            var customTypeId = lwUtil.getUrlParam("customTypeId");
            var articleType = lwUtil.getUrlParam("articleType");
            if(customTypeId!==null &&customTypeId!=="0"){
                $(".main-top select[name=customTypeId]").val(customTypeId);
            }
            if(articleType!==null && articleType!=="0"){
                $(".main-top select[name=articleType]").val(articleType);
            }
            form.render();
        });
    });
});