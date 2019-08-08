layui.use(['jquery','comment','article'],function () {
    var $ = layui.$;
    var comment = layui.comment;
    var articleMod = layui.article;

    /**
     *绑定文章删除事件
     */
        $(".div3").on("click",".removeBtn",function () {
            layer.confirm("确定删除？",function () {
                articleMod.delArticleById(articleId,function () {
                    window.location.replace(contextPath+"/index");
                })
            })
        });

    /**
     * 给文章点赞或取消点赞按钮绑定事件
     */
    $(".articleLikeBtn").click(function () {
        //获取文章id
        var typeId = parseInt($("#articleTitle").attr("data-id"));

        if($(this).hasClass("on")){
            //表示要取消点赞
            comment.undoLike(typeId,1,function (data) {
                if(data.code===0){
                    $(".articleLikeBtn").removeClass("on");
                    var count = parseInt($(".articleLikeBtn .like").text());
                    $(".articleLikeBtn .like").text(count-1);

                }else if(data.code===403){
                    window.location.replace(contextPath+"/login");
                }else{
                    alert("取消点赞失败");
                }
            });

        }else{
            //表示要进行点赞
            var ownerId = parseInt($(".authorId").val());
            comment.doLike(typeId,ownerId,1,function (data) {
                if(data.code===0){
                    $(".articleLikeBtn").addClass("on");
                    var count = parseInt($(".articleLikeBtn .like").text());
                    $(".articleLikeBtn .like").text(count+1);

                }else if(data.code===403){
                    window.location.replace(contextPath+"/login");
                }else if(data.code===402){
                    alert("已经点赞了");
                }else{
                    alert("点赞失败");
                }
            });
        }
    });
    function doLikeDone(data) {
        if(data.code===0){
            var div = $(".comment-list div[data-id="+data.typeId+"]");
            var like_wrapper = "";
            //判断是评论还是回复
            if(div.hasClass("list-item")){
                //表示评论
                like_wrapper = div.find(".con>.info .like_wrapper");
            }else if(div.hasClass("reply-item")){
                //表示回复
                like_wrapper = div.find(".info .like_wrapper");
            }
            like_wrapper.addClass("on");
            like_wrapper.find(".like").text(parseInt(like_wrapper.find(".like").text())+1);

        }else if(data.code===403){
            window.location.replace(contextPath+"/login");
        }else if(data.code===402){
            alert("已经点赞了");
        }
        else{
            alert("点赞失败");
        }
    }



    function undoLikeDone(data) {
        if(data.code===0){
            var div = $(".comment-list div[data-id="+data.typeId+"]");
            var like_wrapper = "";
            //判断是评论还是回复
            if(div.hasClass("list-item")){
                //表示评论
                like_wrapper = div.find(".con>.info .like_wrapper");
            }else if(div.hasClass("reply-item")){
                //表示回复
                like_wrapper = div.find(".info .like_wrapper");
            }
            like_wrapper.removeClass("on");
            like_wrapper.find(".like").text(parseInt(like_wrapper.find(".like").text())-1);

        }else if(data.code===403){
            window.location.replace(contextPath+"/login");
        }else{
            alert("取消点赞失败");
        }
    }

    /**
     * 给点评论或者回复赞按钮绑定事件
     */
    $(".comment-list").on("click",".list-item .like_wrapper",function () {
        var typeId = "";
        var ownerId = 0;
        //获取评论id
        if($(this).parent().parent().hasClass("reply-item")){
            //回复
            typeId = parseInt($(this).parent().parent().attr("data-id"));
            ownerId = parseInt($(this).parent().prev().children(".userName").attr("data-id"));
        }else{
            //评论
            typeId = parseInt($(this).parent().parent().parent().attr("data-id"));
            ownerId = parseInt($(this).parent().parent().find(".userName").attr("data-id"));
        }
        if($(this).hasClass("on")){
            //表示要取消点赞
            comment.undoLike(typeId,2,undoLikeDone);
        }else{
            //表示要进行点赞
            comment.doLike(typeId,ownerId,2,doLikeDone);
        }
    });

    /**
     * 回复的回复按钮
     */
    $(".comment-list").on("click",".list-item .reply-item .reply",function () {
        var replyId = $(this).parent().parent().attr("data-id");
        comment.showInputBox(replyId);
    });

    /**
     * 评论的回复按钮
     */
    $(".comment-list").on("click",".con>.info>.reply",function () {
        var commentId = $(this).parent().parent().parent().attr("data-id");
        comment.showInputBox(commentId);
    });

    /**
     * 填充文章
     */
    function putInArticle(article) {
        $("#articleTitle").text(article.articleTitle);
        $("#articleTitle").attr("data-id",article.id);

        var yearMonth = article.createTime;
        yearMonth = yearMonth.substring(0,yearMonth.lastIndexOf("-"));
        $("#createTime").parent().attr("href",contextPath+"/archives?yearMonth="+yearMonth);
        $("#createTime").text(article.createTime);


        $("#mdText").text(article.articleContent);
        var content = "";
        content = editormd.markdownToHTML("content", {
            htmlDecode: "true", // you can filter tags decode
            emoji: true,
            taskList: true,
            tex: true,
            flowChart: true,
            sequenceDiagram: true
        });

        var html = "";
        if(article.articleTags!==""&& article.articleTags!==null&&article.articleTags!==undefined){
            var tags = article.articleTags.split(";");
            for(var i=0;i<tags.length;i++){
                html += '<a><i class="layui-icon layui-icon-note"></i>'+tags[i]+'</a>';
            }
        }
        $(".div1-left").append(html);

        if(article.customTypeId){
            $("#customTypeName").text(article.customTypeName);
            $("#customTypeName").attr("href",contextPath+"/customTypes?customTypeId="+article.customTypeId);
        }else{
            $("#customTypeName").hide();
        }
        if(article.lastArticleId){
            $(".last>a").attr("href",contextPath+"/article/"+article.lastArticleId);
            $("#last").text(article.lastArticleTitle);
        }
        if(article.nextArticleId){
            $(".next>a").attr("href",contextPath+"/article/"+article.nextArticleId);
            $("#next").text(article.nextArticleTitle);
        }

        $("#like").text(article.likes);
        if(article.isLiked===1){
            $(".articleLikeBtn").addClass("on");
        }

        /**
         * 作者id
         */
        $(".authorId").val(article.authorId);

        var articleType = "未知";
        if(article.articleType===1){
            articleType = "原创";
            $("#articleType").addClass("layui-bg-green");
        }else if(article.articleType===2){
            articleType = "转载";
        }
        $("#articleType").text(articleType);

    }
    /**
     * 获取文章数据
     */
    function getArticle(articleId) {
        $.ajax({
            type:'get',
            url:contextPath+"/getArticle",
            data:{
                id:articleId
            },
            success:function (data) {
                if(data.code===0){
                    putInArticle(data.data);
                }else{
                    $("body").text("文章不存在");
                }
            },
            error:function () {
                layer.alert("获取文章失败");
            }
        });
    }
    /**
     * 初始化
     */
    $(function () {
        //获取文章数据
        getArticle(articleId);
        //获取评论数据
        comment.getComments(1,articleId,1,5);

        $(".commentPub").click(function () {
            var comment_content = $(".comment_content");
            var content = comment_content .val().trim();
            comment.insertComment(1,articleId,content);
        });
        /**
         * 给删除评论按钮绑定事件
         */

        $(".comment-list").on("click",".con>.info>.removeBtn",function () {
            //获取此条评论的id
            var commentId = parseInt($(this).parent().parent().parent().attr("data-id"));
            layer.confirm("确定删除这条评论？",{closeBtn:0},function () {
                layer.closeAll('dialog');
                comment.delComment(commentId);
            });
        });


        /**
         * 给删除回复按钮绑定事件
         */
        $(".comment-list").on("click",".reply-item>.info>.removeBtn",function () {
            var replyId = parseInt($(this).parent().parent().attr("data-id"));
            layer.confirm("确定删除这条回复？",{closeBtn:0},function () {
                layer.closeAll('dialog');
                comment.delReply(replyId);
            });
        });
    });
});
