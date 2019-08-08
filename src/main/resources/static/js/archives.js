layui.use(['jquery','comment','article','form','lwUtil','laypage'],function () {
    var $ = layui.$;
    var layer = layui.layer;
    var lwUtil = layui.lwUtil;
    var laypage = layui.laypage;


    var yearMonth = lwUtil.getUrlParam("yearMonth");
    if(yearMonth===null){
        yearMonth=undefined;
    }
    var pageNum = lwUtil.getUrlParam("pageNum");
    if(pageNum!==null){
        pageNum = parseInt(pageNum);
    }


    /**
     * 获取归档目录
     */
    function findArchiveNameAndArticleNum(callback) {
        $.ajax({
            url:contextPath+"/findArchiveNameAndArticleNum",
            data:{},
            type:'get',
            success:function (data) {
                if(callback){
                    callback(data);
                }
            },
            error:function () {

            }
        });
    }
    function findArchiveNameAndArticleNumDone(data) {
        if(data.code===0){
            var list = data.data;
            var archiveList = $(".archiveList");
            var html = "";
            var sum = 0;
            for(var i=0;i<list.length;i++){
                sum += list[i].num;
                html += "<div class='item'>";
                var yearMonth = list[i].archiveTime;
                yearMonth= yearMonth.substring(0,yearMonth.indexOf("月")).split("年").join("-");
                html += "<span><a href="+contextPath+'/archives?yearMonth='+yearMonth+" class='archiveTime'>"+list[i].archiveTime+"</a><span class='num'>("+list[i].num+")</span></span></div>";
            }
            //文章总数
            $(".articleNum").text(sum);
            archiveList.append(html);
        }else{
            layer.alert("获取归档目录失败");
        }
    }

    /**
     * 获取归档的所有文章
     */
    function getArchiveArticles(pageNum,pageSize,callback) {
        $.ajax({
            url:contextPath+"/getArchiveArticles",
            type:'get',
            data:{
                pageNum:pageNum,
                pageSize:pageSize
            },
            success:function (data) {
                console.log(data);
            }
        })
    }
    function getArchiveArticles(pageNum,pageSize,yearMonth,callback) {
        if(yearMonth===undefined){
            $(".now").text(new Date().getFullYear()+"年");
        }else{
            var arr = yearMonth.split("-");
            $(".now").text(arr[0]+"年"+arr[1]+"月");
        }
        $.ajax({
            url:contextPath+"/getArchiveArticles",
            data:{
                yearMonth:yearMonth,
                pageNum:pageNum,
                pageSize:pageSize
            },
            success:function (data) {
                if(callback){
                    callback(data);
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
                                var url  = window.location.pathname + "?pageNum=" + obj.curr;
                                window.location.href = url;
                                var yearMonth = lwUtil.getUrlParam("yearMonth");
                                if(yearMonth!==null){
                                    window.location.href = contextPath + "/archives" + "?pageNum=" +obj.curr + "&yearMonth=" + yearMonth;
                                }else{
                                    window.location.href = contextPath + "/archives" + "?pageNum=" +obj.curr;
                                }
                            }
                        }
                    });
                }
            },
            error:function () {
                layer.alert("获取文章失败");
            }

        })

    }
    function getArchiveArticlesDone(data) {
        if(data.code===0){
            var list = data.data.list;
            var articleList = $(".articleList");
            var html = "";

            for(var i=0;i<list.length;i++){
                html += "<li class='layui-timeline-item'>";
                html += "<i class='layui-icon layui-timeline-axis'>&#xe63f;</i>";
                html += "<div class='layui-timeline-content layui-text'>";
                html += "<div><div class='layui-row'>";
                html += "<div class='layui-col-md8'>";

                html += "<a target='_blank' href="+contextPath+'/article/'+list[i].id+">";
                html += "<span class='articleTitle'>"+list[i].articleTitle+"</span>"
                html += "</a>";
                var yearMonth = list[i].createTime;
                yearMonth = yearMonth.substring(0,yearMonth.lastIndexOf("-"));
                html += "<a href="+contextPath+'/archives?yearMonth='+yearMonth+"><i class='layui-icon layui-icon-date' style='font-size: 16px;'><span class='createTime'>"+list[i].createTime+"</span></i></a>";
                html += "</div><div class='layui-col-md4' style='text-align: right'>";
                if(list[i].articleType===1){
                    html += "<span class='layui-badge layui-bg-green articleType'>原创</span>"
                }else if(list[i].articleType===2){
                    html += "<span class='layui-badge articleType'>转载</span>"
                }
                html += "</div></div></div></div></li>";
            }
            articleList.append(html);
        }else{
            layer.alert("获取文章失败");
        }

    }
    findArchiveNameAndArticleNum(findArchiveNameAndArticleNumDone);
    getArchiveArticles(pageNum,5,yearMonth,getArchiveArticlesDone);
});
