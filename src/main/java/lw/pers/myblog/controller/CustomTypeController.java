package lw.pers.myblog.controller;


import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.CustomType;
import lw.pers.myblog.model.SessionUserInfo;
import lw.pers.myblog.service.CustomTypeService;
import lw.pers.myblog.util.LoginCheckUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.List;

@Controller
public class CustomTypeController {
    @Autowired
    private CustomTypeService customTypeService;


    /**
     * 文章分类列表
     */
    @GetMapping("/getAllCustomTypes")
    @ResponseBody
    public ResponseMessage getAllCustomTypes(){
        List<CustomType> list = customTypeService.getAll();
        return  ResponseMessageUtil.success(list);
    }

    /**
     * 删除一个文章分类标签
     */
    @PostMapping("/delCustomType")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage delCustomType(@RequestParam("id")int id,@AuthenticationPrincipal Principal principal,HttpSession session){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        customTypeService.delCustomTypeById(id,userInfo.getId());
        return ResponseMessageUtil.success();
    }

    /**
     * 更新一个用户的所有文章分类
     */
    @PostMapping("/updateCustomTypes")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage updateCustomTypes(
            @RequestBody List<CustomType> customTypes,
            @AuthenticationPrincipal Principal principal,HttpSession session){
        LoginCheckUtil.check(principal);
        customTypeService.saveCustomTypes(customTypes);
        return ResponseMessageUtil.success();
    }


    /**
     * 获取个人分类列表及其包含的文章数目
     */
    @GetMapping("/getHasNumList")
    @ResponseBody
    public ResponseMessage getHasNumList(){
        List<Object> list = customTypeService.getHasNumList();
        return ResponseMessageUtil.success(list);
    }

    @GetMapping("/customTypes")
    public String getArticlePage(){
        return "html/customTypes";
    }
}

