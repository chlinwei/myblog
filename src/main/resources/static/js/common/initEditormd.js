function initEditor() {
        testEditor = editormd("my-editormd", { //注意1：这里的就是上面的DIV的id属性值
        width: "100%",
        height: 740,
        syncScrolling: true, //设置双向滚动
        path: contextPath+"/webjars/editor.md/1.5.0/lib/", //lib目录的路径
        // previewTheme : "dark", //代码块使用dark主题
        codeFold : true,
        emoji:true,
        tocm : true, // Using [TOCM]
        tex : true, // 开启科学公式TeX语言支持，默认关闭
        flowChart : true, // 开启流程图支持，默认关闭
        sequenceDiagram : true, // 开启时序/序列图支持，默认关闭,
        htmlDecode : true, //不过滤标签
        imageUpload : true, //上传图片
        imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp","JPG","JPEG","GIF","PNG","BMP","WEBP"],
        imageUploadURL : contextPath+"/uploadArticleImage",
        onload:function () {
        },
        saveHTMLToTextarea: true, //注意3：这个配置，方便post提交表单
        toolbarIcons : function () {
            return ["bold","del","italic","quote","|","h1","h2","h3","h4","h5","h6","|","list-ul","list-ol","hr","|","link","image","code","code-block","table","datetime","html-entities","emoji","|","watch","preview","fullscreen","clear","search","|","help","info"]
        }
    });
}

