package lw.pers.myblog.service;

import lw.pers.myblog.constant.FileType;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

/**
 * 上传文件模块
 */

public interface UploadFileService {
    /**
     * @param: 文件名
     * @param: 文件输入流
     * @param : 文件保存路径
     * @Param: 文件类型
     * @return: 如果上传成功则返回文件的绝对路径
     */
    String uploadfile(String fileName, InputStream inputStream,int fileType);
}
