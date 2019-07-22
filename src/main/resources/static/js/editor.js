layui.use(['jquery','comment','article','form'],function () {
    var $ = layui.$;
    var form = layui.form;
    var article = layui.article;

    //初始化编辑器
    initEditor();
    //表单验证
    form.verify({
        articleTitle:function (value) {
            if(value.trim().length===0){
                return "文章标题不能为空";
            }
        },
        content:function (value) {
            if(value.trim().length===0){
                return "文章内容不能为空";
            }
        },
        customTypeId:function (value) {
            if(value==0){
                return "个人分类不能为空";
            }
        }

    });

    /**
     给标签删除按钮绑定事件
     */
    $(".tagList ").on("click",".removeTagBtn",function () {
        $(this).parent().detach();
    });


    /**
     * 禁止标签中含有";"
     */
    $(".tagList").on("keypress",".tag>span",function (e) {
        if(e.keyCode==59){
            return false;
        }
    });

    /**
     * 添加标签
     */
    $(".addTagBtn").click(function () {
        var tagList = $(".tagList");
        var lastTag = $(".tagList>.tag:last-of-type");
        if(tagList.children().length===5){
            layer.msg("标签最多添加5个");
            return;
        }
        if(lastTag.length===0||lastTag.children("span").text().trim()!==""){
            var div = "<div class='tag'><span contenteditable='true' style='display: inline-block;padding: 0 12px;'></span><a class='removeTagBtn' href='javascript:void(0)'><i class='layui-icon layui-icon-close'></i></a></div>";
            tagList.append(div);
        }
    });
});
