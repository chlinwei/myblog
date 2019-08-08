package lw.pers.myblog.controller;

import lw.pers.myblog.exception.ResponseMessage;
import lw.pers.myblog.exception.ResponseMessageUtil;
import lw.pers.myblog.model.Archive;
import lw.pers.myblog.model.Article;
import lw.pers.myblog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * 归档
 */
@Controller
public class ArchiveController {
    @Autowired
    private ArticleService articleService;

    /**
     *返回归档的目录
     */
    @GetMapping("/findArchiveNameAndArticleNum")
    @ResponseBody
    public ResponseMessage findArchiveNameAndArticleNum(){
        List<Archive> list = articleService.findArchiveNameAndArticleNum();
        return ResponseMessageUtil.success(list);
    }


    /**
     * 返回所有文章:
     * 1.不加条件是返回所有文章
     * 2.加条件是返回当月的文章
     */
    @GetMapping("/getArchiveArticles")
    @ResponseBody
    public ResponseMessage getArchiveArticles(
            //注意yearMonth 的格式是这样的 2019-07
            @RequestParam(value = "yearMonth",required = false)String yearMonth,
            @RequestParam(value = "pageNum",required = false,defaultValue = "1")int pageNum,
            @RequestParam(value = "pageSize",required = false,defaultValue = "10")int pageSize){
        Map<String, Object> data = articleService.getArchiveArticles(yearMonth,pageNum, pageSize);
        return ResponseMessageUtil.success(data);
    }
}
