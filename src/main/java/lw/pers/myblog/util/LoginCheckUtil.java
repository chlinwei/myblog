package lw.pers.myblog.util;


import lw.pers.myblog.exception.MyException;

import java.security.Principal;

/**
 * 检查是否登录,没有登录则抛个异常
 */
public class LoginCheckUtil {
    public static void check(Principal principal){
        if(principal==null){
            throw new MyException(403,"请先登录");
        }
    }
}
