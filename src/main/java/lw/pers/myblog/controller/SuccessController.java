package lw.pers.myblog.controller;

import lw.pers.myblog.model.SessionUserInfo;
import lw.pers.myblog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import javax.servlet.http.HttpSession;
import java.security.Principal;

@Controller
public class SuccessController {

    @Autowired
    private ArticleService articleService;

    /**
     * 此页面为发布文章成功后跳转到的页面
     */
    @GetMapping("/pubSuccess/{articleId}")
    public String getPubSuccessPage(@PathVariable("articleId") int articleId, @AuthenticationPrincipal Principal principal){
        //1.判断是否存在该文章
        boolean b = articleService.articleIsExist(articleId);
        if(!b){
            return "redirect:/error/404";
        }
        return "html/pubArticle_success";
    }
}
