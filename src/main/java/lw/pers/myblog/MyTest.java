package lw.pers.myblog;

import org.apache.tomcat.jni.User;

import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MyTest {
    public static void main(String args[]){
        File file = new File("/web1");
        if (!file.isDirectory()) {
            System.out.println("不存在");
        }else{
            System.out.println("存在");
            System.out.println(file.getAbsoluteFile());
        }
    }
}
