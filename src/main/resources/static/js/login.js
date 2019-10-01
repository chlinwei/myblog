layui.use(['jquery'],function () {
    var $ = layui.$;
    $("#loginBtn").click(function () {
        var userName =$("input[name=userName]").val();
        var passwd =$("input[name=passwd]").val();
        $.ajax({
            type:'post',
            url:contextPath + "/doLogin",
            data:{
                userName:userName,
                passwd:passwd
            },
            success:function (data) {
                if(data.code===0){
                    window.location.href=data.url;

                }else{
                    layer.alert("登录失败");
                }
            },
            error:function () {
                layer.alert("登录失败");
            }
        })
    });
});
