layui.use(['jquery','comment','article','form'],function () {
    var $ = layui.$;
    var form = layui.form;
    form.verify({
        passwd:function (value) {
            if(!/^[^\s]*$/.test(value)){
                return "密码不能含有空白字符"
            }else if(value.length<6){
                return "密码长度不能小于6";
            }else if(value.length>16){
                return "密码长度不能大于16";
            }
        },
        userName:function (value) {
            if(!/^[^\s]*$/.test(value)){
                return "用户名不能含有空白字符"
            }else if(value.length<6){
                return "用户名长度不能小于6";
            }else if(value.length>16){
                return "用户名长度不能大于16";
            }
        }
    });
    function doRegister(user) {
        $.ajax({
            type:'post',
            url:contextPath+"/doRegister",
            data:user,
            success:function (data) {
                if(data.code===0){
                    layer.confirm("恭喜您注册成功,是否跳转到登录页面",function () {
                        window.location.replace(contextPath+"/login");
                    });
                }else{
                    layer.alert(data.msg);
                }
            },
            error:function () {
                layer.alert("注册失败！");
            }
        })
    }

    
    form.on('submit(registerBtn)',function (data) {
        if(data.field.gender==="女"){
            data.field.gender = 2;
        }else{
            data.field.gender = 1;
        }
        doRegister(data.field);
        return false;
    });
});
