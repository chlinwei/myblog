layui.define(['laypage','layer','jquery','form'],function(exports){
    var $ = layui.$;
    var layer = layui.layer;
    var laypage=  layui.laypage;
    var form = layui.form;
    var lw_obj = {

        /**
         * 获取标签
         */
        getTags:function() {
            var spans = $(".tagList>.tag>span");
            var arr =  new Array();
            for(var i=0;i<spans.length;i++){
                var tag = $(spans[i]).text().trim();
                if(tag!==''){
                    arr.push(tag);
                }
            }
            return arr;
        },
        /**
         * 设置标签
         */
        setTags:function (tagList,arr) {
            var html = "";
            for(var i=0;i<arr.length;i++){
                html += "<div class='tag'><span contenteditable='true' style='display: inline-block;padding: 0 12px;'>"+arr[i]+"</span><a class='removeTagBtn' href='javascript:void(0)'><i class='layui-icon layui-icon-close'></i></a></div>";
            }
            tagList.append(html);
        },
        /**
         * 获取文章分类列表
         */
        getPubArticle:function () {
            var article = {
                articleTitle:$("input[name=articleTitle]").val().trim(),
                articleType:parseInt($("select[name=articleType]").val()),
                articleContent:$("textarea[name=my-editormd-markdown-doc]").val().trim(),
                customTypeId:$("select[name=customTypeId]").val(),
                articleTags:lw_obj.getTags().join(";"),
                summary:$("textarea[name=summary]").val().trim()
            };
            if(contextPath){
                //如果不为空""
                article.articleContent = article.articleContent.replace(new RegExp(contextPath,'g'),"");
            }

            if(article.articleTitle.trim()===""){
                article.articleTitle = "无标题文章";
            }
            return article;
        },
        getDraftArticle:function () {
            var article = lw_obj.getPubArticle();
            article.id = parseInt($(".draftId").val());
            return article;

        },
        getCustomTypes:function(callback) {
            $.ajax({
                type:'get',
                url:contextPath+'/getAllCustomTypes',
                data:{},
                success:function (data) {
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("连接服务器失败");
                }
            })
        },
        pubArticle:function (article) {
            if(contextPath){
                article.articleContent = article.articleContent.replace(new RegExp(contextPath,'g'),"");
            }
            $.ajax({
                type:'post',
                url:contextPath + "/pubDraft",
                data:article,
                success:function (data) {
                    if(data.code===0){
                        window.location.replace(contextPath+"/pubSuccess/"+data.data);
                    }

                },
                error:function () {
                    layer.msg("发布文章失败");
                }
            })
        },
        /**
         * 新建草稿
         */
        saveDraft:function (article) {
            if(article.articleContent===""){
                return;
            }
            $(".noticeMessage").val("保存中");
            $(".noticeMessage").show();
            $.ajax({
                type:'post',
                url:contextPath+"/saveDraft",
                data:article,
                success:function (data) {
                    if(data.code===0){
                        $(".draftId").val(data.data);
                        $(".noticeMessage").val("已保存");
                    }else if(data.code===403){
                        layer.alert("用户会话已过期,请登录!");
                        $(".noticeMessage").val("");
                        $(".noticeMessage").hide();
                    }else{
                        layer.alert("文章自动保存草稿失败!");
                        $(".noticeMessage").val("");
                        $(".noticeMessage").hide();
                    }
                },
                error:function () {
                    layer.alert("文章自动保存草稿失败!");
                    $(".noticeMessage").val("");
                    $(".noticeMessage").hide();
                }
            })
        },
        /**
         * 修改草稿
         */
        updateDraft:function (article) {
            $(".noticeMessage").val("保存中");
            $(".noticeMessage").show();
            $.ajax({
                url:contextPath+"/updateDraft",
                type:'post',
                data:article,
                success:function (data) {
                    if(data.code===0){
                        $(".noticeMessage").val("已保存");
                        $(".noticeMessage").show();
                    }else if(data.code===403){
                        $(".noticeMessage").val("");
                        $(".noticeMessage").hide();
                        layer.alert("用户会话已过期,是否登录？!",function () {
                            window.location.replace(contextPath+"/login");
                        });
                    }else{
                        layer.alert("文章自动保存草稿失败!");
                        $(".noticeMessage").val("");
                        $(".noticeMessage").hide();
                    }
                },
                error:function () {
                    layer.alert("文章自动保存草稿失败!");
                    $(".noticeMessage").val("");
                    $(".noticeMessage").hide();
                }
            })
        },
        /**
         * 自动保存草稿
         */
        autoSaveDraft:function() {
            ifvisible.setIdleDuration(120);
            //判断是否为草稿
            //已经保存的草稿
            var timerId = setInterval(function () {
                if($(".draftId").val()===""){
                    //为空表示还是未保存的草稿
                    lw_obj.saveDraft(lw_obj.getPubArticle());
                }else {
                    //修改草稿
                    lw_obj.updateDraft(lw_obj.getDraftArticle());
                }
            }, 8000);
            ifvisible.off("idle");
            ifvisible.off("wakeup");
            ifvisible.idle(function () {
                //闲置时立马执行
                window.clearInterval(timerId);
            });
            ifvisible.wakeup(function () {
                //唤醒时立马执行
                lw_obj.autoSaveDraft();
            });
        },
        /**
         * 个人分类done
         */
        getCustomTypesDone:function(data,callback) {
            if(data.code===0){
                var customTypes = data.data;
                var select = $("select[name=customTypeId]");
                var html = "";
                for(var i=0;i<customTypes.length;i++){
                    html += "<option value="+customTypes[i].id+">"+customTypes[i].name+"</option>";
                }
                select.append(html);
            }else{
                layer.msg("获取个人分类失败");
            }

            if(callback){
                callback();
            }
        },
        /**
         * 获取文章及其个人分类列表
         */
        getArticleAndCustomTypes:function(articleId,callback) {
            $.ajax({
                type:'get',
                url:contextPath+"/getArticleAndCustomTypes",
                data:{
                    id:articleId
                },
                success:function (data) {
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("获取文章失败！");
                }
            })
        },
        getArticleAndCustomTypesDone:function(data) {
            var article = data.data;
            if(data.code===0){
                //articleType
                $("select[name=articleType]").val(article.articleType);

                //articleTitle
                $("input[name=articleTitle]").val(article.articleTitle);

                //articleContent
                $("textarea[name=my-editormd-markdown-doc]").val(article.articleContent);
                initEditor();

                //customType
                var customTypeResult = {
                    code:0,
                    data:article.customTypes
                };
                lw_obj.getCustomTypesDone(customTypeResult);
                $("select[name=customTypeId]").val(article.customTypeId);

                //articleTags
                if(article.articleTags!==""&&article.articleTags!==null&&article.articleTags!==undefined){
                    var arr = article.articleTags.split(";");
                    lw_obj.setTags($(".tagList"),arr);
                }

                //summary
                $("textarea[name=summary]").val(article.summary);

                form.render();

            }else if(data.code===403){
                window.location.replace(contextPath+"/login");
            }else{
                layer.alert("获取数据失败！");
            }
        },
        /**
         * 修改文章
         */
        updateArticle:function (article) {
            $.ajax({
                type:'post',
                url:contextPath+"/updateArticle",
                data:article,
                success:function (data) {
                    if(data.code===0){
                        window.location.replace(contextPath+"/pubSuccess/"+articleId);
                    }else{
                        layer.alert("发布文章失败");
                    }
                },
                error:function () {
                    layer.alert("发布文章失败");
                }
            })
        },
        delArticleById:function (id,callback) {
            $.ajax({
                type:'post',
                url:contextPath+"/delArticle",
                data:{
                    id:id
                },
                success:function (data) {
                    if(callback){
                        callback(data)
                    }
                },
                error:function () {
                    layer.alert("删除文章失败");
                }
            })
        },
        /**
         * 删除一篇草稿
         */
        delDraftById:function (draftId,callback) {
            $.ajax({
                type:'post',
                url:contextPath+"/delDraft",
                data:{
                    draftId:draftId
                },
                success:function (data) {
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("删除失败");
                }
            })
        },
        /**
         * 删除多篇草稿
         */
        delDrafts:function (draftIds,callback) {
            $.ajax({
                url:contextPath+"/delDrafts",
                type:'post',
                data:{
                    draftIds:draftIds
                },
                success:function (data) {
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("删除失败");
                }
            })
        },

        /**
         *修改文章列表的个人分类
         */
        updateArticlesCustomType:function (articleIds,customTypeId,callback) {
            $.ajax({
                type:'post',
                url:contextPath+"/updateArticleCustomTypes",
                data:{
                    articleIds:articleIds,
                    customTypeId:customTypeId
                },
                success:function (data) {
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("修改失败！");
                }
            })
        },
        /**
         * 删除多篇文章
         */
        delArticles:function (articleIds,callback) {
            $.ajax({
                type:'post',
                url:contextPath+"/delArticles",
                data:{
                    articleIds:articleIds
                },
                success:function (data) {
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("删除失败！");
                }
            })
        },
        /**
         * 更新customType表
         */
        updateCustomTypes:function(arr,callback){
            $.ajax({
                type:'post',
                url:contextPath+"/updateCustomTypes",
                data:JSON.stringify(arr),
                dataType:'json',//必填
                contentType:"application/json",//必填
                success:function (data) {
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("保存失败");
                }
            })
        },
        /**
         * 删除一个个人分类
         */
        delCustomType:function(customTypeId,callback) {
            $.ajax({
                type:'post',
                url:contextPath+"/delCustomType",
                data:{
                    id:customTypeId
                },
                success:function (data) {
                    data.data = customTypeId;
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("删除个人分类失败！")
                }
            });
        }

    };
    exports('article',lw_obj);
});
