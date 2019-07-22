package lw.pers.myblog.controller;

import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class LoginController {

    /**
     * 返回登录页面
     */
    @RequestMapping("/login")
    public String loginPage(HttpSession session, HttpServletRequest request) {
        //是否含有登录之前的页面
        SavedRequest savedRequest = (SavedRequest) session.getAttribute("SPRING_SECURITY_SAVED_REQUEST");
        if (savedRequest == null) {
            String referer = request.getHeader("Referer");
            if (referer != null) {
                if (!referer.contains("/login") && !referer.contains("/register")) {
                    session.setAttribute("lastUrl", referer);
                }
            }
        }
        return "html/login";
    }
}
