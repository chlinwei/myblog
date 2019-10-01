package lw.pers.myblog.config;

import lw.pers.myblog.exception.MyException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.io.File;

@Configuration
@ConfigurationProperties(prefix = "myblog")
@PropertySource("classpath:config/myblog.properties")
public class MyBlogConfig {
    @Value("${myblog.fileRootPath}")
    private String fileRootPath;

    //访问资源文件的映射路径
    final private String thirdResource="thirdResource";


    public String getFileRootPath() {
        File folder = new File(fileRootPath);
        if(!folder.isDirectory()){
            //如果文件夹不存在则创建
            fileRootPath = System.getProperty("user.home")+ File.separator + "myblog";
            folder = new File(fileRootPath);
            boolean flag = folder.mkdirs();
            if(!flag){
                throw new MyException("创建文件夹:"+fileRootPath+"失败");
            }
        }
        return fileRootPath;
    }

    public String getThirdResource() {
        return thirdResource;
    }
}
