layui.use(['jquery','comment','article','form'],function () {
    var $ = layui.$;
    var form = layui.form;
    var articleMod = layui.article;
    articleMod.getArticleAndCustomTypes(articleId,articleMod.getArticleAndCustomTypesDone);

    form.on('submit(pubBtn)',function (data) {
        data.field.articleContent = data.field["my-editormd-markdown-doc"];
        delete data.field["my-editormd-markdown-doc"];
        delete data.field["my-editormd-html-code"];
        data.field.articleTags = articleMod.getTags().join(";");
        data.field.id = articleId;
        articleMod.updateArticle(data.field);
    });
});

