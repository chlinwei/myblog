layui.use(['jquery','comment','article','form','laypage','lwUtil'],function () {
    var $ = layui.$;
    var laypage = layui.laypage;
    var lwUtil = layui.lwUtil;
    var articleMod = layui.article;

    var pageNum = lwUtil.getUrlParam("pageNum");
    if(pageNum!==null){
        pageNum = parseInt(pageNum);
    }
    laypage.render({
        elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
        ,count: 50 //数据总数，从服务端得到
    });

    /**
     * 获取主页文章列表
     */
    function getIndexArticles(pageNum,pageSize,callback) {
        $.ajax({
            type:'get',
            url:contextPath+"/getIndexArticles",
            data:{
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
                                window.location.href=contextPath+"/index" + "?pageNum=" + obj.curr;
                                // getIndexArticles(obj.curr,obj.limit,getIndexArticlesDone);
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
                html += "<a class='customType'>"+article.customTypeName+"</a></div></div>";

                html += "<div class='article-entry'><span class='articleBrief'>"+article.articleBrief+"</span></div>";
                html += "<div class='read-all'><a target='_blank' href="+contextPath+'/article/'+article.articleId+" >阅读全文<i class='layui-icon layui-icon-next'></i></a></div>";
                html += "<hr>";
                html += "<div class='article-tags'>";
                var arrTag = article.articleTags.split(";");
                for(var j=0;j<arrTag.length;j++){
                    html += "<i class='layui-icon layui-icon-note'><a href=''>"+arrTag[j]+"</a></i>";
                }
                html += "</div></div></div>";
            }
            articleList.append(html);
        }else{
            layer.alert("获取主页文章列表失败！");
        }
    }

    /**
     * 获取文章
     */
    getIndexArticles(pageNum,5,getIndexArticlesDone);

    /**
     * 获取个人分类
     */
    articleMod.getCustomTypes(function (data) {
        console.log(data);
    });



});
