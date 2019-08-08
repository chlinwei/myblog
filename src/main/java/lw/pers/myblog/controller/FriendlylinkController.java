package lw.pers.myblog.controller;

import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.Friendlink;
import lw.pers.myblog.service.FriendlinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class FriendlylinkController {

    @Autowired
    private FriendlinkService friendlinkService;

    /**
     * 返回所有友情链接
     * @return
     */
    @GetMapping("/getFriendlylinks")
    @ResponseBody
    public ResponseMessage getAllFriendlinks(){
        List<Friendlink> links = friendlinkService.getAll();
        return ResponseMessageUtil.success(links);
    }
}
