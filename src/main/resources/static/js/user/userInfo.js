layui.use(['jquery','form','laydate','upload'],function () {
    var $ = layui.$;
    var form = layui.form;
    var laydate = layui.laydate;
    var upload = layui.upload;

    //头像上传
    var uploadInst = upload.render({
        elem: '#uploadBtn'
        ,url: contextPath+"/uploadAvatar"
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#avatar').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){
            if(res.code===403){
                //没有登录,直接跳转到登录页面
                window.location.replace(contextPath+"/login");
            }else if(res.code===0){
                //上传成功
                $("#headerAvatar").attr("src",$("#avatar").attr("src"));
            }else{
                return layer.msg('上传失败');
            }
        }
        ,error: function(){
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();
            });
        }
    });

    /**
     * 获取个人信息
     */
    function getUserInfo() {
        $.ajax({
            type:'get',
            url:contextPath+"/getUserInfo",
            data:{},
            success:function (data) {
                getUserInfoDone(data);
            },
            error:function () {
                layer.msg("个人信息获取失败");
            }
        })
    }

    function getUserInfoDone(data) {
        var user = data.data;
        if(data.code===403){
            window.location.replace(contextPath+"/login");
        }else if(data.code===0){
            $("input[name=userName]").val(user.userName);
            $("input[name=phone]").val(user.phone);
            $("input[name=email]").val(user.email);
            $("input[name=gender][value=1]").attr("checked",user.gender === 1 ? true : false);
            $("input[name=gender][value=2]").attr("checked",user.gender === 2 ? true : false);
            $("textarea[name=personalBrief]").val(user.personalBrief);
            $("textarea[name=sign]").val(user.sign);
            form.render('radio');
            /**
             * 生日
             */
            laydate.render({
                elem: '#birthday',
                value:user.birthday
            });
        }else{
            layer.msg("个人信息获取失败");
        }
    }
    function saveUserInfo(data) {
        $.ajax({
            type:'post',
            url:contextPath+"/saveUserInfo",
            data:data,
            success:function (data) {
                if(data.code===0){
                    layer.msg("个人信息保存成功");
                }else if(data.code===201){
                    layer.alert("个人信息保存成功,重新登录生效",{closeBtn:0},function () {
                        window.location.replace(contextPath+"/login");
                    });
                }else if(data.code === 403){
                    window.location.reload();
                }
                else{
                    layer.msg("个人信息保存失败");
                }
            },
            error:function () {
                layer.msg("个人信息保存失败");
            }
            
        })
    }
    getUserInfo();
    form.on('submit(saveUserInfo)',function (data) {
        saveUserInfo(data.field);
        return false;
    });
});

