layui.use(['jquery','comment','article','form'],function () {
    var $ = layui.$;
    var form = layui.form;
    var article = layui.article;
    initEditor();

    //获取个人分类
    article.getCustomTypes(function (data) {
        article.getCustomTypesDone(data,function () {
            form.render();
        });
    });

    $(".draftBtn").click(function () {
        if($(".draftId").val()==""){
            article.saveDraft(article.getPubArticle());
        }else{
            article.updateDraft(article.getDraftArticle());
        }
    });
    article.autoSaveDraft();
    //发布文章
    form.on('submit(pubBtn)',function (data) {
        data.field.articleContent = data.field["my-editormd-markdown-doc"];
        delete data.field["my-editormd-markdown-doc"];
        delete data.field["my-editormd-html-code"];
        data.field.articleTags = article.getTags().join(";");
        var draftId = $(".draftId").val();
        if(draftId!==""&&draftId!==null&&draftId!==undefined){
            data.field.id = parseInt(draftId);
        }
        article.pubArticle(data.field);
    });
});

