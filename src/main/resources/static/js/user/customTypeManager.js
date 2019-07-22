layui.use(['article','form','jquery','article'],function () {
    var $ = layui.$;
    var form = layui.form;
    var articleMod = layui.article;

    function getCustomTypesDone(data) {
        if(data.code===0){
            var list = data.data;
            var html = "";
            var tbody = $("#table tbody");
            for(var i=0;i<list.length;i++){
                html += "<tr><td><input type='text' data-id="+list[i].id+" class='layui-input' value="+list[i].name+"></td><td><button class='layui-btn layui-btn-danger layui-btn-sm delBtn' type='button'>删除</button></td></tr>";
            }
            tbody.append(html);


        }else if(data.code===403){
            window.location.replace(contextPath+"/login");
        }
        else{
            layer.alert("获取数据失败！");
        }
    }

    /**
     * 获取个人分类
     */
    articleMod.getCustomTypes(function (data) {
        getCustomTypesDone(data);
    });

    /**
     * 添加,最多有30个标签
     */
    $(".addBtn").click(function () {
        var trs = $("#table tbody tr");
        if(trs.length>=30){
            layer.msg("最多可添加30个分类");
        }else{
            var tbody = $("#table tbody");
            var html = "<tr><td><input type='text' data-id class='layui-input'></td><td><button class='layui-btn layui-btn-danger layui-btn-sm delBtn' type='button'>删除</button></td></tr>";
            tbody.append(html);
        }
    });

    /**
     * 获取表格里的分类信息
     */
    function getTableCustomTypes(){
        var inputs = $("#table tbody tr input");
        var arr = [];
        for(var i=0;i<inputs.length;i++){
            var $input = $(inputs[i]);
            var name = $input.val().trim();
            if(name===""){
                layer.msg("分类名称不能为空");
                return;
            }
            var id = 0;
            if($input.attr("data-id")!==""){
                id = parseInt($input.attr("data-id"));
            }
            var obj = {
                name:name,
                id:id
            };
            arr.push(obj);
        }
        return arr;
    }

    $(".saveBtn").click(function () {
        var arr = getTableCustomTypes();
        if(!(arr instanceof Array)){
            return;
        }
        articleMod.updateCustomTypes(arr,function (data) {
            if(data.code===0){
                layer.msg("保存成功",{time:700},function () {
                    window.location.reload();
                });
            }else if(data.code===403){
                window.location.reload();
            }else{
                layer.alert("保存失败！");
            }
        })
    });
    /**
     * 删除
     */
    $("#table").on("click",".delBtn",function () {
        var input = $(this).parent().parent().find("input");
        if(input.attr("data-id")===""){
            $(this).parent().parent().detach();
        }else{
            var id = parseInt(input.attr("data-id"));
            layer.confirm("确定删除？",function (index) {
                articleMod.delCustomType(id,function (data) {
                    layer.close(index);
                    if(data.code===0){
                        $("input[data-id="+data.data+"]").parent().parent().detach();
                    }else if(data.code===403){
                        window.location.reload();
                    }else{
                        layer.alert("删除失败！");
                    }
                })
            })
        }
    })
});
