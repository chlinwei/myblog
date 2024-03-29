package lw.pers.myblog.util;


import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 作用:用户头像将uri转化为url
 *
 */
public class AvatarlUtil {
    /**
     * 文章保存、修改,的时候去掉图片链接的contextPath
     */
    public static String delContextPath(String avatarUrl){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String contextPath = request.getContextPath();
        if("".equals(contextPath)){
            return avatarUrl;
        }
        String pattern  = "("+contextPath+")"; //.*?是非贪婪,.*是贪婪
        avatarUrl = avatarUrl.replaceAll(pattern,"$1");
        return avatarUrl;
    }
    /**
     * 文章展现的时候给图片链接添加contextPath
     */
    public static String addContextPath(String avatarUrl){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String contextPath = request.getContextPath();
        if("".equals(contextPath)){
            return avatarUrl;
        }
        return  contextPath + avatarUrl;
    }
}
