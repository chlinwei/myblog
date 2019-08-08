package lw.pers.myblog.controller;

import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.Article;
import lw.pers.myblog.model.SessionUserInfo;
import lw.pers.myblog.service.ArticleService;
import lw.pers.myblog.service.impl.FtpService;
import lw.pers.myblog.util.LoginCheckUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.security.Principal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
public class ArticleController {
    @Autowired
    private FtpService ftpService;

    @Autowired
    private ArticleService articleService;

    /**
     *查看一篇文章,返回文章显示界面,这里注意一个问题,就是关于路径变量articleId,由于thymeleaf是在controller后面执行的,
     * 此时thymeleaf会将路径变量保存到request域中,所以这里不必手动将articleId保存到request中
     */
    @GetMapping("/article/{articleId}")
    public String getArticlePage(@PathVariable("articleId") int articleId){
        if(!articleService.articleIsExist(articleId)){
            //不存在
            return "html/error/articleNotFound";
        }
        return "html/articleRead";
    }


    /**
     *返回修改文章界面
     */
    @GetMapping("/update/{articleId}")
    public String updateArticlePage(@PathVariable("articleId") int articleId,HttpServletRequest request,@AuthenticationPrincipal Principal principal,HttpSession session) throws InvocationTargetException, IllegalAccessException {
        LoginCheckUtil.check(principal);
        //判断用户是否含有这篇文章
        boolean b = articleService.articleIsExist(articleId);
        if(!b){
            //不存在
            return "html/error/articleNotFound";
        }
//        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
//        Map<String,Object> map = articleService.getArticleById(articleId,userInfo.getId());
//        request.setAttribute("article",map);
        return "html/articleUpdate";
    }

    /**
     * 获取文章查看界面的文章数据
     */
    @GetMapping("/getArticle")
    @ResponseBody
    public ResponseMessage getArticle(int id,HttpSession session) throws InvocationTargetException, IllegalAccessException {
        Integer myId = null;
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        if(userInfo!=null){
            myId = userInfo.getId();
        }
        Map article = articleService.getArticleById(id,myId);
        return ResponseMessageUtil.success(article);
    }

    /**
     * 返回文章及其个人分类列表
     */
    @GetMapping("/getArticleAndCustomTypes")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage getArticleAndCustomTypes(int id,HttpSession session) throws InvocationTargetException, IllegalAccessException {
        Integer myId = null;
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        if(userInfo!=null){
            myId = userInfo.getId();
        }
        //存在
        Map article = articleService.getArticleAndCustomTypesByArticleId(id,myId);
        return ResponseMessageUtil.success(article);
    }

    /**
     * 获取文章修改界面的文章数据
     */
    @GetMapping("/getUpdatePageArticle")
    @ResponseBody
    public ResponseMessage getUpdatePageArticle(@RequestParam("articleId") int articleId,HttpSession session,@AuthenticationPrincipal Principal principal){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        Map<String,Object> map = articleService.getUpdatePageArticle(articleId, userInfo.getId());
        return ResponseMessageUtil.success(map);
    }

    /**
     * 文章图片上传
     * 注意:这里editormd期望你返回给前端的的json是 {success:0|1,message,url} 0:表示上传失败,1表示成功
     */
    @PostMapping("/uploadArticleImage")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public Map<String,Object> uploadArticleImage(HttpSession session, @RequestParam("editormd-image-file") MultipartFile file, @AuthenticationPrincipal Principal principal, HttpServletResponse response) throws IOException {
        HashMap<String, Object> map = new HashMap<>();
        if(file.isEmpty()){
            map.put("success",0);
            map.put("message","图片不存在");
            return map;
        }
        //设置返回头后页面才能获取返回url
        response.setHeader("X-Frame-Options", "SAMEORIGIN");
        String userName = principal.getName();
        //获取文件名称
        String fileName = file.getOriginalFilename();
        //获取文件后缀名
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        //生成新的文件
        fileName = UUID.randomUUID()+suffixName;
        //上传文件
        InputStream inputStream = file.getInputStream();
        String uri =  "";
        String url = "";
        try {
            uri = ftpService.uploadFile(fileName, inputStream, "/articleImage");
            url ="http://"+ftpService.getHost()+uri;
            map.put("success",1);
            map.put("message", "上传成功");
            map.put("url",url);
        }catch (Exception e){
            map.put("success",0);
            map.put("message","上传失败,msg:"+e.getMessage());
        }
        return map;
    }


    /**
     * 删除一篇文章
     */
    @PostMapping("/delArticle")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage delArticle(@RequestParam("id") int id, HttpSession session, @AuthenticationPrincipal Principal principal){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        int  userId = userInfo.getId();
        articleService.delArticle(id,userId);
        return ResponseMessageUtil.success("删除成功");
    }
    /**
     * 删除多个文章
     */
    @PostMapping("/delArticles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage delArticles(@RequestParam("articleIds[]") int[] articleIds, HttpSession session, @AuthenticationPrincipal Principal principal){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        int  userId = userInfo.getId();
        articleService.delArticles(articleIds,userId);
        return ResponseMessageUtil.success("删除成功");
    }


    /**
     * 修改一篇文章
     */
    @PostMapping("/updateArticle")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage updateArticle(Article article,HttpSession session,@AuthenticationPrincipal Principal principal){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        article.setUserId(userInfo.getId());
        articleService.updateArticle(article);
        return ResponseMessageUtil.success();
    }


    /**
     * 获取文章管理界面的文章列表
     */
    @GetMapping("/getArticlesInManager")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage getArticlesInManager(
            @RequestParam(value = "customTypeId",required = false) Integer customTypeId,
            @RequestParam(value = "articleType",required = false) String articleType,
            @RequestParam(value = "pageNum",required = false,defaultValue = "1")int pageNum,
            @RequestParam(value = "pageSize",required = false,defaultValue = "5")int pageSize,
            @AuthenticationPrincipal Principal principal,HttpSession session)
    {
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        if("".equals(articleType)){
            articleType = null;
        }
        Map map = articleService.getArticlesInManager(pageNum, pageSize, customTypeId, articleType);
        return ResponseMessageUtil.success(map);
    }

    /**
     * 修改文章的文章分类
     */
    @PostMapping("/updateArticleCustomTypes")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage updateArticleCustomTypes(
            //注意这里接受数组参数的写法
            @RequestParam("articleIds[]")int[] articleIds,
            @RequestParam("customTypeId")int customTypeId,
            @AuthenticationPrincipal Principal principal,HttpSession session){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        articleService.updateArticlesCustomType(userInfo.getId(),articleIds,customTypeId);
        return ResponseMessageUtil.success();
    }

}





