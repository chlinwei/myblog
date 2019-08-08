package lw.pers.myblog;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MyTest {
    public static void main(String args[]){
        String  str = "![](http://192.168.0.10/articleImage/34/70/0f305ec7-2606-4478-8b39-f395bbca5d51.jpg)你好嘻嘻嘻![](http://192.168.0.10/articleImage/34/70/0f305ec7-2606-4478-8b39-f395bbca5d51.jpg)";
        String value = str.replaceAll("(!\\[\\]\\(http://)(.*?/)","$1www.baidu.com/");
        System.out.println(value);
        System.out.println(str);
    }
}
