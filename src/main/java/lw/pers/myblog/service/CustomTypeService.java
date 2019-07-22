package lw.pers.myblog.service;

import lw.pers.myblog.model.CustomType;

import java.util.List;

public interface CustomTypeService {

    /**
     * 删一个
     */
    public void delCustomTypeById(int id, int userId);


    /**
     * 查
     */
    public List<CustomType> getAll();


    /**
     * 保存用户的文章分类
     */
    public void saveCustomTypes(List<CustomType> customTypes);
}
