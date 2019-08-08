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

    /**
     * 返回所有个人分类列表及其每个列表所包含的文章数目
     */
    public List<Object> getHasNumList();
}
