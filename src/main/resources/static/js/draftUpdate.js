layui.use(['jquery','comment','article','form'],function () {
    var $ = layui.$;
    var form = layui.form;
    var articleMod = layui.article;

    /**
     * 从服务器端获取草稿数据
     */
    function getDraftAndCustomTypes(draftId,callback) {
        $.ajax({
            type:'get',
            url:contextPath+"/getDraftAndCustomTypes",
            data:{
                draftId:draftId
            },
            success:function (data) {
                if(callback){
                    callback(data);
                }
            },
            error:function () {
                layer.alert("获取草稿失败");
            }

        })
    }
    getDraftAndCustomTypes(draftId,articleMod.getArticleAndCustomTypesDone);

    $(".draftBtn").click(function () {
        articleMod.updateDraft(articleMod.getDraftArticle());
    });
    articleMod.autoSaveDraft();
    //发布文章
    form.on('submit(pubBtn)',function (data) {
        data.field.articleContent = data.field["my-editormd-markdown-doc"];
        delete data.field["my-editormd-markdown-doc"];
        delete data.field["my-editormd-html-code"];
        data.field.articleTags = articleMod.getTags().join(";");
        data.field.id = draftId;
        articleMod.pubArticle(data.field);
    });

});
