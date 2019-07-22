package lw.pers.myblog.controller;

import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.SessionUserInfo;
import lw.pers.myblog.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * /userBlog/1页面
 */
@Controller
public class UserBlogController {
    @Autowired
    private UserService userService;

    @Autowired
    private LikeService likeService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private VisitorService visitorService;
    @Autowired
    private ArticleService articleService;
    /**
     * /userBlog页面
     * 获取用户基本信息
     */
    @ResponseBody
    @GetMapping("/getUserInfoInUserBlog")
    public ResponseMessage getUserInfoInUserBlog(@RequestParam("userId")int userId){
        Map<String, Object> userInfo = userService.getUserInfoInUserBlog(userId);
        return ResponseMessageUtil.success(userInfo);
    }

    /**
     * 用户博客页面
     */
    @GetMapping("/userBlog/{userId}")
    public String getUserBlog(@PathVariable("userId") int userId, HttpSession session, HttpServletRequest request){
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        boolean b = userService.userIsExist(userId);
        if(b){
            //表示此用户存在
            if(userInfo!=null){
                //当前用户已经登录
                if(userId!=userInfo.getId()){
                    visitorService.updateVisitor(userInfo.getId(),userId);
                }
            }
        }
        request.setAttribute("userIsExist",b);
        return "html/userBlog";
    }
    /**
     * 总和信息
     */
    @GetMapping("/getSummary")
    @ResponseBody
    public ResponseMessage getSummary(@RequestParam("userId") int userId){
        Map<String,Object> map = new HashMap<>();
        //文章总数
        int articleNum = articleService.countArticle(userId);
        //点赞总数
        int likeNum = likeService.getAllLikesByOwnerId(userId);

        //人气计算
        map.put("articleNum",articleNum);
        map.put("likeNum",likeNum);
        return ResponseMessageUtil.success(map);
    }


    /**
     * 获取某个用户的最新发布的文章
     */
    @GetMapping("/getLatestArticlesInSomeone")
    @ResponseBody
    public ResponseMessage getLatestArticlesInSomeone(@RequestParam("userId")int userId,@RequestParam("num") int num){
        List<Map<String, Object>> list = articleService.getLatestArticlesInSomeone(userId, num);
        return ResponseMessageUtil.success(list);
    }

}
