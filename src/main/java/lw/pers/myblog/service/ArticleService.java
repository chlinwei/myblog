package lw.pers.myblog.service;

import lw.pers.myblog.model.Archive;
import lw.pers.myblog.model.Article;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;

public interface ArticleService {
    public void saveArticle(Article article);

    //获取articleRead.html展示的文章
    public Map getArticleById(int id, Integer myId) throws InvocationTargetException, IllegalAccessException;

    public String getArticleTitleByArticleId(int articleId);

    public Map getArticleAndCustomTypesByArticleId(int id, Integer myId) throws InvocationTargetException, IllegalAccessException;


    public boolean articleIsExist(int id);

    /**
     * 删除一篇文章
     * @param id:文章id
     * @param userId:用户id
     */
    public void delArticle(int id, int userId);

    /**
     * 删除多个文章
     * @param articleIds:文章id列表
     * @param userId:用户id
     */
    public void delArticles(int[] articleIds, int userId);

    public Map<String,Object> getUpdatePageArticle(int id, Integer myId);

    public void updateArticle(Article article);

    /**
     * 返回文章管理界面的文章list
     */
    public Map getArticlesInManager(int pageNum, int pageSize, Integer customTypeId, String articleType);

    /**
     *
     * @param userId:用户id
     * @param articleIds :文章id数组
     * @param customTypeId:文章分类的id
     */
    public void updateArticlesCustomType(int userId, int[] articleIds, int customTypeId);

    /**
     * 获取最新发布的文章
     */
    public List<Map<String,Object>> getLatestArticles(int num);

    /**
     * 获取所有的文章
     */
    public Map<String,Object> getIndexArticles(Integer customTypeId,int pageNum, int pageSize);

    /**
     * 获取所有文章数目
     */
    public int getAllArticleNum();

    /**
     *归档:返回归档列表
     */
    public List<Archive> findArchiveNameAndArticleNum();


    /**
     * 返回归档界面的所有文章
     */
    public Map<String,Object> getArchiveArticles(String yearMonth,int pageNum,int pageSize);
}
