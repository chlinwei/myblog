layui.use(['jquery','form'],function () {
    var $ = layui.$;
    var form = layui.form;

    form.verify({
        newPasswd:function (value) {
            if(!/^[^\s]*$/.test(value)){
                return "新密码不能含有空白字符"
            }else if(value.length<6){
                return "密码长度不能小于6";
            }else if(value.length>16){
                return "密码长度不能大于16";
            }
            if(value.trim().length===0){
                return "新密码不能为空";
            }
        },
        surePasswd:function (value) {
            if($("input[name=newPasswd]").val()!==value){
                return "两次密码输入的不一致";
            }
        }
    });

    form.on('submit(submit)',function (data) {
        $.ajax({
            type:'post',
            url:contextPath + "/updatePasswd",
            data:{
                newPasswd:data.field.newPasswd
            },
            success:function (data) {
                if(data.code===0){
                    layer.alert("密码更新成功需要登录",{closeBtn:0},function () {
                        window.location.reload();
                    });
                }
            },
            error:function () {
                layer.msg("密码更新失败");
            }
        });
        return false;
    })
});
