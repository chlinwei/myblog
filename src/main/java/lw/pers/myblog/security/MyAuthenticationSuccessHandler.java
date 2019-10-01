package lw.pers.myblog.security;

import lw.pers.myblog.model.SessionUserInfo;
import lw.pers.myblog.model.User;
import lw.pers.myblog.service.UserService;
import lw.pers.myblog.util.AvatarlUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.SavedRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * 完成登录后,初始化工作
 */
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler{
    @Autowired
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {

        HttpSession session = httpServletRequest.getSession();
        //将个人信息保存在session
        String userName = authentication.getName();
        User user = userService.findUserByUserName(userName);
        SessionUserInfo userInfo = new SessionUserInfo();
        String imgUri = user.getAvatarImgUri();
        if(imgUri==null||"".equals(imgUri)){
            imgUri = httpServletRequest.getContextPath()+"/image/avatar.png ";
        }else{
            imgUri = AvatarlUtil.addContextPath(imgUri);
        }
        userInfo.setAvatarUrl(imgUri);
        userInfo.setId(user.getId());
        userInfo.setUserName(user.getUserName());
        session.setAttribute("userInfo",userInfo);


        //修改用户最近登录时间
        userService.updateLastLoginTime(user.getId());

        //要重定向的页面,默认是index
        String redirectUrl = httpServletRequest.getContextPath()+"/index";
        SavedRequest savedRequest= (SavedRequest) session.getAttribute("SPRING_SECURITY_SAVED_REQUEST");
        String lastUrl = (String) session.getAttribute("lastUrl");
        if(lastUrl!=null){
            redirectUrl = lastUrl;
            session.removeAttribute("lastUrl");
        }else if(savedRequest != null){
            redirectUrl = savedRequest.getRedirectUrl();
            session.removeAttribute("SPRING_SECURITY_SAVED_REQUEST");
        }
        JSONObject res = new JSONObject();
        try {
            res.put("code",0);
            res.put("msg","登录成功");
            res.put("url",redirectUrl);
        } catch (JSONException e1) {
            e1.printStackTrace();
        }
        httpServletResponse.setContentType("application/json;charset=UTF-8");
        httpServletResponse.getWriter().write(res.toString());
    }
}

