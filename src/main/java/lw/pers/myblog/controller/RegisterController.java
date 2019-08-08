package lw.pers.myblog.controller;

import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.User;
import lw.pers.myblog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@Controller
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/doRegister")
    @ResponseBody
    public ResponseMessage register(User user, HttpServletRequest request) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        userService.createUser(user);
        String contextPath = request.getContextPath();
        Map<String,String> map = new HashMap<>();
        map.put("url",contextPath+"/index");
        return ResponseMessageUtil.success(map);
    }
}
