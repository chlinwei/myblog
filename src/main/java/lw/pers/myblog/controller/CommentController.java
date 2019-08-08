package lw.pers.myblog.controller;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.Comment;
import lw.pers.myblog.model.SessionUserInfo;
import lw.pers.myblog.service.CommentService;
import lw.pers.myblog.util.LoginCheckUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@Controller
public class CommentController {

    @Autowired
    private CommentService commentService;

    /**
     *获取一个主题id下的所有评论和回复
     */
    @GetMapping("/getComments")
    @ResponseBody
    public ResponseMessage getComments(@RequestParam("topicType")int topicType,
                                       @RequestParam("topicId")int topicId,
                                         @RequestParam("pageNum")int pageNum,
                                         @RequestParam("pageSize")int pageSize){
        //注意这里的写法
        Map comments = commentService.getAllComments(topicType,topicId,pageNum,pageSize);
        return ResponseMessageUtil.success(comments);
    }

    /**
     * 删除一个回复
     */
    @PostMapping("/delReply")
    @ResponseBody
    public ResponseMessage delReply(@RequestParam("id")int id, @AuthenticationPrincipal Principal principal, HttpSession session){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        commentService.delReply(id,userInfo.getId());
        return ResponseMessageUtil.success();
    }

    /**
     * 删除一条评论,及其相关的回复
     */
    @PostMapping("/delComment")
    @ResponseBody
    public ResponseMessage delComment(@RequestParam("id")int id,@AuthenticationPrincipal Principal principal,HttpSession session){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        commentService.delComment(id,userInfo.getId());
        return ResponseMessageUtil.success();
    }

    /**
     * 插入条评论
     */
    @PostMapping("/insertComment")
    @ResponseBody
    public ResponseMessage insertComment(@RequestParam("topicType")int topicType,
                                         @RequestParam("topicId")int topicId,
                                         @RequestParam("content")String content,
                                         @AuthenticationPrincipal Principal principal,
                                         HttpSession session){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        Comment comment = new Comment();
        comment.setFromUid(userInfo.getId());
        comment.setContent(content);
        comment.setTopicType(topicType);
        comment.setTopicId(topicId);
        commentService.insertComment(comment);
        return ResponseMessageUtil.success(comment.getId());
    }


    /**
     * 插入一条回复
     */
    @PostMapping("/insertReply")
    @ResponseBody
    public ResponseMessage insertReply(@RequestParam("pId")int pId,
                                       @RequestParam("topicType")int topicType,
                                       @RequestParam("topicId")int topicId,
                                       @RequestParam("content")String content,
                                       @RequestParam("toUid")int toUid,
                                       @AuthenticationPrincipal Principal principal,
                                       HttpSession session){
        LoginCheckUtil.check(principal);
        SessionUserInfo userInfo = (SessionUserInfo) session.getAttribute("userInfo");
        int id = userInfo.getId();
        Comment comment = new Comment();
        comment.setFromUid(id);
        comment.setpId(pId);
        comment.setTopicType(topicType);
        comment.setTopicId(topicId);
        comment.setContent(content);
        comment.setToUid(toUid);
        commentService.insertReply(comment);
        return ResponseMessageUtil.success(comment.getId());
    }
}

