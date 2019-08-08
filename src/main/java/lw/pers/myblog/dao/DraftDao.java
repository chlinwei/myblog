package lw.pers.myblog.dao;

import lw.pers.myblog.model.Article;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 草稿表和文章表公用一个model
 */
public interface DraftDao {
    /**
     * 获取草稿表列表
     */
    public List<Article> getDraftList();

    /**
     * 删除一篇草稿
     */
    public void delOne(@Param("id") int id);

    /**
     * 获取一篇草稿
     */
    public Article getOne(@Param("id") int id);

    /**
     * 保存一篇草稿
     */
    public void saveDraft(@Param("article") Article article);

    /**
     * 修改一篇草稿
     */
    public void updateDraft(@Param("article") Article article);

}
