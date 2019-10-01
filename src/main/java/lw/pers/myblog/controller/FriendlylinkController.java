package lw.pers.myblog.controller;

import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.Friendlylink;
import lw.pers.myblog.service.FriendlylinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class FriendlylinkController {

    @Autowired
    private FriendlylinkService friendlylinkService;

    /**
     * 返回所有友情链接
     * @return
     */
    @GetMapping("/getFriendlylinks")
    @ResponseBody
    public ResponseMessage getAllFriendlinks(){
        List<Friendlylink> links = friendlylinkService.getAll();
        return ResponseMessageUtil.success(links);
    }
    /**
     * 添加一条链接
     */
    @PostMapping("/addFriendlyLink")
    @ResponseBody
    public ResponseMessage addFriendlyLink(){
        return  null;
    }

}
