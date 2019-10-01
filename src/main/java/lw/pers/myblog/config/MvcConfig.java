package lw.pers.myblog.config;

import lw.pers.myblog.constant.UploadBaseDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Autowired
    private MyBlogConfig myBlogConfig;
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("html/index");
        registry.addViewController("/index").setViewName("html/index");
        registry.addViewController("/index.html").setViewName("html/index");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler(myBlogConfig.getThirdResource()+"/**")
                .addResourceLocations("file:"+myBlogConfig.getFileRootPath()+"/");
    }
}
