package lw.pers.myblog.controller;

import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.SessionUserInfo;
import lw.pers.myblog.service.ArticleService;
import lw.pers.myblog.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class IndexController {
    @Autowired
    private ArticleService articleService;
    @Autowired
    private CommentService commentService;

    /**
     * 获取主页的文章列表
     */
    @GetMapping("/getIndexArticles")
    @ResponseBody
    public ResponseMessage getIndexArticles(
            @RequestParam(value = "pageNum",required = false,defaultValue = "1")int pageNum,
            @RequestParam(value = "pageSize",required = false,defaultValue = "10")int pageSize,
            @RequestParam(value = "customTypeId",required = false)Integer customTypeId
    ){
        System.out.println("customTypeId:"+customTypeId);
        Map<String, Object> allArticle = articleService.getIndexArticles(customTypeId,pageNum, pageSize);
        return ResponseMessageUtil.success(allArticle);
    }

    /**
     * 获取最新发布的文章
     */
    @GetMapping("/getLatestArticles")
    @ResponseBody
    public ResponseMessage getLatestArticles(@RequestParam("num") int num){
        List<Map<String, Object>> list = articleService.getLatestArticles(num);
        return ResponseMessageUtil.success(list);
    }

    /**
     * 获取概括
     */
    @GetMapping("getIndexSummary")
    @ResponseBody
    public ResponseMessage getIndexSummary(){
        Map map = new HashMap<String,Object>();
        int articleNum = articleService.getAllArticleNum();
        int commentNum = commentService.countComment();
        map.put("articleNum",articleNum);
        map.put("commentNum",commentNum);
        return ResponseMessageUtil.success(map);
    }

    /**
     * 获取最新评论
     */
    @GetMapping("/getLatestComments")
    @ResponseBody
    public ResponseMessage getLastComments(
            @RequestParam(value = "pageNum",required = false,defaultValue = "1")int pageNum,
            @RequestParam(value = "pageSize",required = false,defaultValue = "5")int pageSize
            ){
        Map latestComments = commentService.getLatestComments(pageNum, pageSize);
        return ResponseMessageUtil.success(latestComments);
    }
}


