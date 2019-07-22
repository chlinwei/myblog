layui.define(['laypage','layer','jquery'],function(exports){
    var $ = layui.$;
    var layer = layui.layer;
    var laypage=  layui.laypage;
    var lw_obj = {
        /**
         * 显示回复框框
         */
        showInputBox:function(id) {
            var toUid = 0;
            var pId = id;
            //先获取
            var inputBox = $($(".inputBox")[0]);
            if(inputBox.length===0){
                //说明没有,则需要创建
                inputBox = $(".comment-wrapper").clone();
                inputBox.addClass("inputBox");
            }else{
                inputBox.detach();
            }
            inputBox.attr("id","inputBox");
            var commentCancel = inputBox.find(".commentCancel");
            commentCancel.off("click");
            commentCancel.click(function () {
                $(this).parent().parent().detach();
            });
            var ele = $('.comment-list .list-item[data-id='+id+']');
            var replyBox = "";
            inputBox.val("");
            if(ele.length!==0){
                //情况1:回复评论
                replyBox = $('.comment-list div[data-id='+id+'] .replyBox');

            }else{
                //情况2:回复回复
                replyBox = $('.comment-list div[data-id='+id+']').parent();
                toUid = $('.reply-item[data-id='+id+']').find(".userName").attr("data-id");
                //获取toUid对应的userName
                var toUserName =$($('.userName[data-id='+toUid+']')[0]).text();

                //提示用户回复的对象
                pId= replyBox.parent().parent().attr("data-id");
                inputBox.find(".comment_content").attr("placeholder","回复 "+toUserName+" :");
            }
            // //防止多次click
            inputBox.off("click");
            inputBox.on("click",".commentPub",function () {
                lw_obj.insertReply(1,articleId,toUid,pId);
            });
            var comment_content = inputBox.find(".comment_content");
            comment_content.val("");
            inputBox.appendTo(replyBox.parent());
            //判断InputBox是否在浏览器中可见

            var doc_begin = $(document).scrollTop();
            var doc_end = doc_begin + $(window).height();
            if($("#inputBox").offset().top + $("#inputBox").height()>doc_end){
                $(document).scrollTop($("#inputBox").offset().top-$(window).height()/2+$("#inputBox").height()/2);
            }
        },

        /**
         * 点赞和取消点赞
         */
        doLike:function (typeId,ownerId,type,callback) {
            $.ajax({
                type:'post',
                url:contextPath+"/doLike",
                data:{
                    typeId:typeId,
                    ownerId:ownerId,
                    type:type
                },
                success:function (data) {
                    data.typeId = typeId;
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("点赞失败！");
                }
            })
        },
        undoLike:function (typeId,type,callback) {
            $.ajax({
                type:'post',
                url:contextPath+"/undoLike",
                data:{
                    typeId:typeId,
                    type:type
                },
                success:function (data) {
                    data.typeId = typeId;
                    if(callback){
                        callback(data);
                    }
                },
                error:function () {
                    layer.alert("取消点赞失败");
                }
            })
        },
        /**
         * 删除回复
         */
        delReply:function (id) {
            $.ajax({
                type:'post',
                url:contextPath + "/delReply",
                data:{
                    id:id
                },
                success:function (data) {
                    if(data.code===0){
                        //删除成功
                        //把对应的reply-item删除就可以了
                        $('.replyBox .reply-item[data-id='+id+']').detach();
                        var  count = parseInt($(".commentSum").text());
                        $(".commentSum").text(count-1);
                    }else if(data.code===403){
                        window.location.replace(contextPath+"/login");
                    }else{
                        layer.alert("删除失败");
                    }
                },
                error:function () {
                    layer.alert("删除失败");
                }
            })
        },
        /**
         * 删除评论及其所包含的回复
         */
        delComment:function (id) {
            //获取要被删除的元素
            var item = $('.comment-list .list-item[data-id='+id+']');
            $.ajax({
                type:'post',
                url:contextPath + "/delComment",
                data:{
                    id:id
                },
                success:function (data) {
                    var count =parseInt($(".commentSum").text());
                    var replyItems = item.find(".reply-item");
                    if(replyItems.length===0){
                        count = count - 1;
                    }else{
                        count = count - replyItems.length-1;
                    }
                    $(".commentSum").text(count);
                    if(data.code===0){
                        item.detach();
                    }if(data.code===403){
                        window.location.replace(contextPath+"/login");
                    }
                },
                error:function () {
                    layer.alert("删除这条评论失败！");
                }
            })

        },
        /**
         * 填充评论列表
         */
        putInComment:function(comments) {
            var commentList = $($(".comment-list")[0]);
            commentList.empty();
            for(var i=0;i<comments.length;i++ ){
                var comment = comments[i];
                var itemDiv = "<div class='list-item' data-id="+comment.id+"><div class='fl user-face'><a><img src="+comment.fromUserVo.url+"></a></div>";
                itemDiv += '<div class="fl con">';
                itemDiv += "<div class='user'><a class='userName' data-id="+comment.fromUserVo.id+">"+comment.fromUserVo.userName+"</a></div>";
                itemDiv += '<p class="content">'+comment.content+'</p>';

                itemDiv += '<div class="info">';
                itemDiv += '<span class="floor">#'+comment.floor+'</span>';
                itemDiv += '<span class="time">'+comment.createTime+'</span>';
                //有人点赞
                if(comment.isLiked===1){
                    //本用户点赞了
                    itemDiv += "<span  class='like_wrapper on'><i class='layui-icon layui-icon-praise like-icon'><span class='like'>" + comment.likes + "</span></i></span>";
                }else {
                    itemDiv += "<span  class='like_wrapper'><i class='layui-icon layui-icon-praise like-icon'><span class='like'>" + comment.likes + "</span></i></span>";
                }
                // itemDiv += '<span class="reply" onclick="showInputBox('+comment.id+')">回复</span>';
                itemDiv += '<span class="reply">回复</span>';
                //判断是否登录,且登录的用户idh和评论id是一样的
                if(userInfo){
                    //登录了
                    if(userInfo.id === comment.fromUserVo.id){
                        itemDiv += "<span class='removeBtn'><i class='layui-icon layui-icon-delete'></i></span>";
                    }
                }

                itemDiv += '</div><div class="replyBox">';
                //回复
                if(comment.replyMaps){
                    for(var j=0;j<comment.replyMaps.length;j++){
                        var reply = comment.replyMaps[j];
                        itemDiv += '<div class="reply-item" data-id='+reply.id+'>';
                        itemDiv += "<a class='reply-face'><img src="+reply.replyFromUserVo.url+"></a>";

                        itemDiv += '<div class="reply-con">';
                        itemDiv += "<a class='userName' data-id="+reply.replyFromUserVo.id+">"+reply.replyFromUserVo.userName+"</a>";
                        //判断有没有回复对象
                        if(reply.replyToUserVo){ //reply-con
                            //有回复对象
                            itemDiv += "<span>回复&nbsp;<a class='content'>@"+reply.replyToUserVo.userName+"</a><span>："+reply.content+"</span></div></span>";
                        }else{
                            itemDiv += '<span class="content">'+reply.content+'</span></div>';
                        }

                        itemDiv += '<div class="info">';
                        itemDiv += '<span class="time">'+reply.createTime+'</span>';
                        if(reply.isLiked===1){
                            itemDiv += '<span class="like_wrapper on"><i class="layui-icon layui-icon-praise"><span class="like">'+reply.likes+'</span></i></span>';
                        }else {
                            itemDiv += '<span class="like_wrapper"><i class="layui-icon layui-icon-praise"><span class="like">' + reply.likes + '</span></i></span>';
                        }
                        // itemDiv += '<span class="reply" onclick="showInputBox('+reply.id+')">回复</span>';
                        itemDiv += '<span class="reply">回复</span>';
                        //判断是否登录,且登录用户和回复的用户是一样的
                        if(userInfo){
                            //登录了
                            if(userInfo.id === reply.replyFromUserVo.id){
                                itemDiv += "<span class='removeBtn'><i class='layui-icon layui-icon-delete'></i></span>";
                            }
                        }
                        itemDiv += '</div></div>'; //reply-Item
                    }
                }
                itemDiv += '</div></div><div class="clear"></div></div></div>';
                commentList.append(itemDiv);
            }

        },

        /**
         * 插入一条评论
         */
        insertComment:function(topicType,topicId) {
            var comment_content = $(".comment_content");
            var content = comment_content .val().trim();
            if(content===""){
                layer.msg("评论不能为空白");
                return;
            }
            $.ajax({
                type:'post',
                url:contextPath+"/insertComment",
                data:{
                    topicType:topicType,
                    topicId:topicId,
                    content:content
                },
                success:function (data) {
                    //评论总数加1
                    var sum =parseInt($(".commentSum").text());
                    $(".commentSum").text(sum+1);
                    if(data.code===0){
                        var list = $(".comment-list");
                        var html = "<div class='list-item' data-id="+data.data+">";

                        html += "<div class='fl user-face'>";
                        html +="<a><img src="+userInfo.avatarUrl+"></a></div>";

                        html += "<div class='fl con'>";
                        html += "<div class='user'><a class='userName' data-id="+userInfo.id+">"+userInfo.userName+"</a></div>";
                        html += "<p class='content'>"+content+"</p>";

                        html += "<div class='info'>";
                        html += "<span class='time'>刚刚</span>";
                        html += "<span  class='like_wrapper'><i class='layui-icon layui-icon-praise'><span class='like'>0</span></i></span>";
                        html += '<span class="reply">回复</span>';
                        html += "<span class='removeBtn'><i class='layui-icon layui-icon-delete'></i></span>";
                        html +="</div><div class='replyBox'></div></div><div class='clear'></div></div>";
                        list.prepend(html);
                        comment_content.val("");

                    }else if(data.code===403){
                        window.location.replace(contextPath+"/login");
                    }
                },
                error:function () {
                    layer.alert("发布评论失败");
                }
            });

        },
        /**
         * 获取评论
         */
        getComments:function(topicType,topicId,pageNum,pageSize) {
            $.ajax({
                type:'get',
                url:contextPath+"/getComments",
                data:{
                    topicType:topicType,
                    topicId:topicId,
                    pageNum:pageNum,
                    pageSize:pageSize
                },
                success:function (data) {
                    if(data.code===0){
                        var comments = data.data.list;
                        //填充评论总数
                        $(".commentSum").text(data.data.commentNum);
                        lw_obj.putInComment(comments);
                        laypage.render({
                            elem: 'pagination'
                            ,curr:data.data.pageNum
                            ,count:data.data.total
                            ,theme: '#FF5722'
                            ,limit:data.data.pageSize,
                            jump:function(obj,first){
                                if(obj.pages===1){
                                    $("#pagination").hide();
                                }else{
                                    $("#pagination").show();
                                }
                                if(!first){
                                    lw_obj.getComments(topicType,topicId,obj.curr,obj.limit);
                                }
                            }
                        });
                    }
                },
                error:function () {
                    layer.alert("获取评论失败");
                }

            });
        },
        /**
         * 插入一条回复:
         * type:1.对评论进行回复
         * type:2.对回复进行回复
         */
        insertReply:function(topicType,topicId,toUid,pId) {
            var content = $(".inputBox").find(".comment_content").val().trim();
            var replyBox = $(".inputBox").parent().children(".replyBox");
            if(content===""){
                layer.msg("回复不能为空!");
                return;
            }
            $.ajax({
                type:'post',
                url:contextPath+"/insertReply",
                data:{
                    topicType:topicType,
                    topicId:topicId,
                    toUid:toUid,
                    content:content,
                    pId:pId
                },
                success:function (data) {
                    if(data.code===0){
                        var html = "<div class='reply-item' data-id="+data.data+">";
                        html += "<a class='reply-face'><img src="+userInfo.avatarUrl+"></a>";

                        html += "<div class='reply-con'>";
                        html += "<a class='userName' data-id="+userInfo.id+">"+userInfo.userName+"</a>";
                        if(toUid===0){
                            //表示是回复评论
                            html += "<span class='content'>"+content+"</span>";
                        }else{
                            //表示是回复回复
                            //获取toUid对应的userName
                            var toUserName =$($('.userName[data-id='+toUid+']')[0]).text();
                            html += "<span>回复&nbsp;<a class='content'>@"+toUserName+"</a><span>："+content+"</span></span>";
                        }
                        html +="</div>";
                        html += "<div class='info'>";
                        html += "<span class='time'>刚刚</span>";
                        html += "<span  class='like_wrapper'><i class='layui-icon layui-icon-praise'><span class='like'>0</span></i></span>";
                        html += '<span class="reply">回复</span>';
                        html += "<span class='removeBtn'><i class='layui-icon layui-icon-delete'></i></span>";
                        html += "</div></div>";
                        replyBox.prepend(html);
                        $(".inputBox").find(".comment_content").val("");
                        var count = parseInt($(".commentSum").text());
                        $(".commentSum").text(count+1);

                    }else if(data.code===403){
                        window.location.replace(contextPath+"/login");
                    }else{
                        layer.msg("回复失败！");
                    }

                },
                error:function () {
                    layer.msg("回复失败！");
                }

            })
        }
    };
    //输出test接口
    exports('comment', lw_obj);
});

