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
        elem: 'test1'
        ,count: 50
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
                                var url  = window.location.pathname + "?pageNum=" + obj.curr;
                                window.location.href = url;
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
            //文章总数目
            $(".articleNum").text(data.data.total);
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
                var yearMonth = article.createTime;
                yearMonth = yearMonth.substring(0,yearMonth.lastIndexOf("-"));
                html += "<a href="+contextPath+'/archives?yearMonth='+yearMonth+" class='layui-icon layui-icon-date' style='font-size:18px;'><span style='font-size:14px;'>"+article.createTime+"</span></a>";
                if(article.customTypeId){
                    html += "<a href="+contextPath+'/customTypes?customTypeId='+article.customTypeId+" class='customType'>"+article.customTypeName+"</a></div></div>";
                }else{
                    html += "</div></div>";
                }
                html += "<div class='article-entry' >"+article.articleBrief+"</div>";
                html += "<div class='read-all'><a target='_blank' href="+contextPath+'/article/'+article.articleId+" >阅读全文<i class='layui-icon layui-icon-next'></i></a></div>";
                html += "<hr>";
                html += "<div class='article-tags'>";
                if(article.articleTags!==""&& article.articleTags!==null&&article.articleTags!==undefined){
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

    /**
     * 获取文章
     */
    getIndexArticles(pageNum,5,getIndexArticlesDone);

    /**
     * 获取个人分类
     */
    articleMod.getCustomTypes(function (data) {
        // console.log(data);
    });

    /**
     * 获取最新评论
     */
    function getLatestComments(pageNum,pageSize,callback) {
        $.ajax({
            type:'get',
            url:contextPath+"/getLatestComments",
            data:{
                pageNum:pageNum,
                pageSize:pageSize
            },
            success:function (data) {
                if(callback){
                    callback(data);
                    laypage.render({
                        elem: 'commentPagination',
                        layout: ['prev', 'next']
                        ,curr:data.data.pageNum
                        ,count:data.data.total
                        ,theme: '#FF5722'
                        ,limit:data.data.pageSize,
                        jump:function(obj,first){
                            if(obj.pages===1){
                                $("#commentPagination").hide();
                            }else{
                                $("#commentPagination").show();
                            }
                            if(!first){
                                getLatestComments(obj.curr,obj.limit,getLatestCommentsDone);
                            }
                        }
                    });
                }

            },
            error:function () {
                layer.alert("获取最新评论失败！");
            }
        })
    }
    function getLatestCommentsDone(data) {
        if(data.code===0){
            var list = data.data.list;
            //评论总数目
            $(".commentNum").text(list.length);
            var ul = $(".commentList");
            if(list.length===0){
                ul.text("暂无评论");
                return;
            }
            ul.empty();
            var html = "";
            for(var i=0;i<list.length;i++){
                html += "<li>";
                html += "<div class='li-top layui-row'>";

                html += "<div class='layui-col-md7 ellipsis'>";
                html += "<a class='title' href="+list[i].url+">"+list[i].title+"</a></div>";

                html += "<div class='layui-col-md5 createTime-div'>";
                html += "<span class='createTime'>"+list[i].createTime+"</span></div></div>";

                html += "<div class='li-bottom'>";
                html += "<span class='fromUserName'>"+list[i].fromUserName+"</span>";
                if(list[i].toUid){
                    html += "<span>&nbsp;&nbsp;回复&nbsp;@"+list[i].toUserName+"："+list[i].content+"</span>";
                }else{
                    html += "<span>："+list[i].content+"</span>";
                }
                html += "</div></li>";
            }
            ul.append(html);

        }else{
            layer.alert("获取最新评论失败！");
        }
    }
    getLatestComments(1,5,getLatestCommentsDone);
});
