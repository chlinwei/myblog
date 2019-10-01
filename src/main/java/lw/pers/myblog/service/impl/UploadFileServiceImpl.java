package lw.pers.myblog.service.impl;

import lw.pers.myblog.config.MyBlogConfig;
import lw.pers.myblog.constant.FileType;
import lw.pers.myblog.constant.UploadBaseDir;
import lw.pers.myblog.exception.MyException;
import lw.pers.myblog.service.UploadFileService;
import lw.pers.myblog.util.DirCreateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
public class UploadFileServiceImpl implements UploadFileService {

    @Autowired
    private MyBlogConfig myBlogConfig;
    private int byteLength = 1024;

    @Override
    public String uploadfile(String fileName, InputStream inputStream, int fileType){
        String baseDir = "";
        if(FileType.articleFile==fileType){
            baseDir = UploadBaseDir.articleImage;
        }else if(FileType.avatarFile==fileType){
            baseDir = UploadBaseDir.userAvatar;
        }else{
            throw new MyException("fileType不符合要求");
        }
        String randomPath = DirCreateUtil.direCreate();
        String returnUrl =  "/"+myBlogConfig.getThirdResource() +"/"+ baseDir + randomPath + "/"+fileName;
        String realFileName = myBlogConfig.getFileRootPath()+ File.separator+ baseDir + randomPath + File.separator+fileName;
        File realFile = new File(realFileName);

        if(!realFile.getParentFile().exists()){
            //如果父目录不存在，则创建
            boolean flag1 = realFile.getParentFile().mkdirs();
            if(!flag1){
                //父目录创建失败
                throw new MyException("saveDir的父目录:"+realFile.getParentFile().toString() +"创建失败");
            }
        }
        //父目录存在
        OutputStream output = null;
        try {
            output = new FileOutputStream(realFileName);
        } catch (FileNotFoundException e) {
            throw new MyException("根据文件名:"+realFileName+"来创建输出流失败");
        }
        int readLen = 0;
        byte[] bytes = new byte[byteLength];
        try {
            while ((readLen=inputStream.read(bytes))!=-1){
                output.write(bytes,0,readLen);
            }
        } catch (IOException e) {
            throw new MyException("读取文件:"+realFileName+"失败");
        }
        //文件已经保存成功
        //例如返回的是:/thirdResource/articleImage/34/234/a.png
        return returnUrl;
    }
}
