layui.use(['jquery','comment','article','form','laypage','lwUtil'],function () {
    var laypage = layui.laypage;
    var $ = layui.$;
    var lwUtil = layui.lwUtil;
    var pageNum = lwUtil.getUrlParam("pageNum");
    if(pageNum!==null){
        pageNum = parseInt(pageNum);
    }

    var customTypeId = lwUtil.getUrlParam("customTypeId");
    if(customTypeId!==null){
        customTypeId = parseInt(customTypeId);
    }
    /**
     * 获取所有个人分类列表
     */
    function getHasNumList(callback) {
        $.ajax({
            url:contextPath+"/getHasNumList",
            type:'get',
            success:function (data) {
                if(callback){
                    callback(data);
                }
            },
            error:function () {

            }
        });
    }
    function getHasNumListDone(data) {
        if(data.code===0){
            var list = data.data;
            var customTypeList = $(".customTypeList");
            var html = "";
            $(".title .num").text(list.length);
            for(var i=0;i<list.length;i++){
                if(window.location.href.indexOf("customTypeId="+list[i].id)!==-1){
                    html += "<div class='item on'><a href="+contextPath+'/customTypes?customTypeId='+list[i].id+">"+list[i].name+'（<span>'+list[i].num+'</span>）'+"</a></div>";
                }else if(window.location.href.indexOf("customTypeId")===-1){
                    $(".customTypeList").find(".item:first-child").addClass("on");
                    html += "<div class='item'><a href="+contextPath+'/customTypes?customTypeId='+list[i].id+">"+list[i].name+'（<span>'+list[i].num+'</span>）'+"</a></div>";

                }else{
                    html += "<div class='item'><a href="+contextPath+'/customTypes?customTypeId='+list[i].id+">"+list[i].name+'（<span>'+list[i].num+'</span>）'+"</a></div>";
                }
            }
            customTypeList.append(html);

        }else{
            layer.alert("获取个人分类失败");
        }
    }

    /**
     * 获取主页文章列表
     */
    function getIndexArticles(customTypeId,pageNum,pageSize,callback) {
        $.ajax({
            type:'get',
            url:contextPath+"/getIndexArticles",
            data:{
                customTypeId:customTypeId,
                pageNum:pageNum,
                pageSize:pageSize
            },
            success:function (data) {
                if(callback){
                    callback(data);
                    laypage.render({
                        elem: 'pagination'
                        ,curr:data.data.pageNum
                        ,count:data.data.total
                        ,theme: '#FF5722'
                        ,limit:data.data.pageSize,
                        jump:function(obj,first){
                            if(obj.pages===1){
                                $("#pagination").hide();
                            }else{
                                $("#pagination").show();
                            }
                            if(!first){
                                var customTypeId = lwUtil.getUrlParam("customTypeId");
                                if(customTypeId!==null){
                                    customTypeId = parseInt(customTypeId);
                                    window.location.href = contextPath + "/customTypes" + "?pageNum=" +obj.curr + "&customTypeId=" + customTypeId;
                                }else{
                                    window.location.href = contextPath + "/customTypes" + "?pageNum=" +obj.curr;
                                }
                            }
                        }
                    });
                }
            },
            error:function () {
                layer.alert("获取主页文章列表失败！");
            }
        })
    }

    /**
     * 填充主页
     */
    function getIndexArticlesDone(data){
        if(data.code===0){
            var list = data.data.list;
            var html = "";
            var articleList = $(".articleList");
            for(var i=0;i<list.length;i++){
                var article = list[i];
                html += "<div class='article myCard'>";

                html += "<div class='article-top'>";
                html += "<h1><a target='_blank' href="+contextPath+'/article/'+article.articleId+">"+article.articleTitle+"</a></h1>";

                html += "<div class='article-info'>";
                if(article.articleType===1){
                    html += "<span class='layui-badge layui-bg-green articleType'>原创</span>";
                }else if(article.articleType===2){
                    html += "<span class='layui-badge articleType'>转载</span>";

                }
                html += "<i class='layui-icon layui-icon-date' style='font-size:18px;'><span style='font-size:14px;'>"+article.createTime+"</span></i>";

                if(article.customTypeId){
                    html += "<a href="+contextPath+'/customTypes?customTypeId='+article.customTypeId+" class='customType'>"+article.customTypeName+"</a></div></div>";
                }
                html += "<div class='article-entry'><span class='articleBrief'>"+article.articleBrief+"</span></div>";
                html += "<div class='read-all'><a target='_blank' href="+contextPath+'/article/'+article.articleId+" >阅读全文<i class='layui-icon layui-icon-next'></i></a></div>";
                html += "<hr>";
                html += "<div class='article-tags'>";
                if(article.articleTags!==""&&article.articleTags!==null&&article.articleTags!==undefined){
                    var arrTag = article.articleTags.split(";");
                    for(var j=0;j<arrTag.length;j++){
                        html += "<i class='layui-icon layui-icon-note'><a href=''>"+arrTag[j]+"</a></i>";
                    }
                }
                html += "</div></div></div>";
            }
            articleList.append(html);
        }else{
            layer.alert("获取主页文章列表失败！");
        }
    }
    getHasNumList(getHasNumListDone);
    getIndexArticles(customTypeId,pageNum,5,getIndexArticlesDone);
});
