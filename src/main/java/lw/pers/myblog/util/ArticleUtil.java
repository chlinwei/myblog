package lw.pers.myblog.util;

import lw.pers.myblog.model.Article;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 文章工具类
 */
public class ArticleUtil {

    /**
     * 文章保存、修改,的时候去掉图片链接的contextPath
     */
    public static void delContextPathInContent(Article article){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String contextPath = request.getContextPath();
        if("".equals(contextPath)){
            return;
        }
        String content = article.getArticleContent();
        String pattern  = "(!\\[\\]\\()"+contextPath+""; //.*?是非贪婪,.*是贪婪
        content = content.replaceAll(pattern,"$1");
        article.setArticleContent(content);
    }
    /**
     * 文章展现的时候给图片链接添加contextPath
     */
    public static void addContextPathInContent(Article article){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String contextPath = request.getContextPath();
        if("".equals(contextPath)){
            return;
        }
        String content = article.getArticleContent();
        String pattern  = "(!\\[\\]\\()"; //.*?是非贪婪,.*是贪婪
        content = content.replaceAll(pattern,"$1"+contextPath);
        article.setArticleContent(content);
    }
}
