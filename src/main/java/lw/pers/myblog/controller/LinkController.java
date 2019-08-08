package lw.pers.myblog.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LinkController {
    /**
     * 用户个人信息
     */
    @GetMapping("/user/userInfo")
    String userInfo(){
        return "html/user/userInfo";
    }

    /**
     * 用户安全设置
     */
    @GetMapping("/user/securitySetting")
    String securitySetting(){
        return "html/user/securitySetting";
    }


    /**
     * 用户文章管理
     */
    @GetMapping("/user/articleManager")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    String articleManager(){
        return "html/user/articleManager";
    }

    /**
     *用户草稿管理
     */
    @GetMapping("/user/draftManager")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    String draftManager(){
        return "html/user/draftManager";
    }

    /**
     * 用户分类管理
     */
    @GetMapping("/user/customTypeManager")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    String customTypeManager(){
        return "html/user/customTypeManager";
    }

    /**
     *文章编辑
     */
    @GetMapping("/editor")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    String editor(){
        return "html/articleAdd";
    }

    /**
     *用户注册
     */
    @GetMapping("/register")
    String register(){
        return "html/register";
    }

    /**
     * 友情链接
     */
    @GetMapping("/friendlylink")
    String friendlylink(){
        return "html/friendlylink";
    }

    /**
     * 归档
     */
    @GetMapping("/archives")
    String archives(){
        return "html/archives";
    }
}
