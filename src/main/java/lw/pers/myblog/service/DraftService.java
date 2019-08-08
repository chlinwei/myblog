package lw.pers.myblog.service;

import lw.pers.myblog.model.Article;

import java.util.Map;

public interface DraftService {

    /**
     * 获取草稿表列表
     */
    public Map<String,Object> getDraftList(int pageNum, int pageSize);


    /**
     * 判断草稿是否存在
     */
    public boolean draftIsExist(int draftId);

    /**
     * 删除一条草稿
     */
    public void delOne(int id);

    /**
     * 删除几篇草稿
     */
    public void delMany(int[] ids);

    /**
     * 获取一篇草稿
     */
    public  Map<String,Object> getOne(int id);

    /**
     * 获取草稿和个人分类
     */
    public Map<String,Object> getDraftAndCustomTypes(int id);


    /**
     * 保存一篇草稿
     */
    public void saveDraft(Article article);

    /**
     * 修改一篇草稿
     */
    public void updateDraft(Article article);

    /**
     * 将草稿发布成文章
     */
    public void pubDraft(Article article);
}
