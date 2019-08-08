package lw.pers.myblog.controller;

import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.Article;
import lw.pers.myblog.model.SessionUserInfo;
import lw.pers.myblog.service.DraftService;
import lw.pers.myblog.util.LoginCheckUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.Map;

@Controller
public class DraftController {
    @Autowired
    private DraftService draftService;

    @GetMapping("/getDraftList")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage getDraftList(
            @RequestParam(value = "pageNum",required = false,defaultValue = "1")int pageNum,
            @RequestParam(value = "pageSize",required = false,defaultValue = "5")int pageSize,
            @AuthenticationPrincipal Principal principal){
        LoginCheckUtil.check(principal);
        Map<String, Object> result = draftService.getDraftList(pageNum, pageSize);
        return ResponseMessageUtil.success(result);
    }

    @GetMapping("/draft/{draftId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String getDraftPage(@PathVariable("draftId")int draftId, @AuthenticationPrincipal Principal principal, HttpSession session,HttpServletRequest request){
        LoginCheckUtil.check(principal);
        //判断是否有这篇草稿
        boolean b = draftService.draftIsExist(draftId);
        if(!b){
            return "html/error/articleNotFound";
        }
        return "html/draftUpdate";
    }

    /**
     * 保存草稿
     */
    @PostMapping("/saveDraft")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage saveDraft(Article article,@AuthenticationPrincipal Principal principal,HttpSession session){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        article.setUserId(userInfo.getId());
        draftService.saveDraft(article);
        return ResponseMessageUtil.success(article.getId());
    }

    /**
     * 获取草稿
     */
    @GetMapping("/getDraft")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage getDraft(@RequestParam("draftId")int draftId,@AuthenticationPrincipal Principal principal){
        LoginCheckUtil.check(principal);
        Map<String, Object> result = draftService.getOne(draftId);
        return ResponseMessageUtil.success(result);
    }
    /**
     * 获取草稿及其文章类型
     */
    @GetMapping("/getDraftAndCustomTypes")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage getDraftAndCustomTypes(@RequestParam("draftId")int draftId,@AuthenticationPrincipal Principal principal){
        LoginCheckUtil.check(principal);
        Map<String, Object> result = draftService.getDraftAndCustomTypes(draftId);
        return ResponseMessageUtil.success(result);
    }

    /**
     * 修改草稿
     */
    @PostMapping("/updateDraft")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage updateDraft(Article article,@AuthenticationPrincipal Principal principal,HttpSession session){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        article.setUserId(userInfo.getId());
        draftService.updateDraft(article);
        return ResponseMessageUtil.success();
    }


    /**
     * 将草稿发布成文章
     */
    @PostMapping("/pubDraft")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage pubDraft(Article article,@AuthenticationPrincipal Principal principal,HttpSession session){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        article.setUserId(userInfo.getId());
        draftService.pubDraft(article);
        return ResponseMessageUtil.success(article.getId());
    }

    /**
     * 删除一篇草稿
     */
    @PostMapping("/delDraft")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage delDraft(@RequestParam(name = "draftId",required = true)int draftId,@AuthenticationPrincipal Principal principal){
        LoginCheckUtil.check(principal);
        draftService.delOne(draftId);
        return ResponseMessageUtil.success();
    }

    /**
     * 删除几篇草稿
     */
    @PostMapping("/delDrafts")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @ResponseBody
    public ResponseMessage delDraft(@RequestParam(name = "draftIds[]",required = true)int[] draftIds,@AuthenticationPrincipal Principal principal){
        LoginCheckUtil.check(principal);
        draftService.delMany(draftIds);
        return ResponseMessageUtil.success();
    }






}
