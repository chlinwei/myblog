package lw.pers.myblog.dao;

import lw.pers.myblog.model.Archive;
import lw.pers.myblog.model.Article;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 文章doa
 */
public interface ArticleDao {
    /**
     * 插入一篇文章
     */
    public void insertArticle(Article article);

    /**
     * 获取所有文章数目
     */
    public int getAllArticleNum();

    /**
     * 根据文章id,获取一篇文章
     */
    public Article getArticleById(int id);

    /**
     * 根据用户id和文章id来获取一篇文章
     */
//    public Article getArticleByUserIdAndId(@Param("id") int id, @Param("userId") int userId);

    /**
     * 根据文章id,返回下一篇文章id
     */
    public Article getNextArticleId(@Param("id") int id);

    /**
     * 根据文章id,返回上一篇文章id
     */
    public Article getLastArticleId(@Param("id") int id);


    /**
     * 删除一篇文章
     */
    public void delArticleById(@Param("id") int id);

    /**
     * 修改一篇文章
     */
    public void updateArticle(Article article);

    /**
     * 根据文章分类和类型返回文章列表
     */
    public List<Article> getArticlesInManager(@Param("customTypeId") Integer customTypeId, @Param("articleType") String articleType);

    /**
     * @param userId:用户id
     * @param id:文章id
     * @param customTypeId:文章分类id
     */
    public void updateCustomType(@Param("userId") int userId, @Param("id") int id, @Param("customTypeId") int customTypeId);

    /**
     * 获取最新发布的文章
     */
    public List<Article>  getlatestArticles(@Param("num") int num);

    /**
     * 根据文章分类获取文章列表
     */
    public List<Article> getAllArticle(@Param("customTypeId")Integer customTypeId);

    /**
     * 根据文章id来获取文章标题
     */
    public String getArticleTitleByArticleId(@Param("articleId") int articleId);

    /**
     * 归档:返回归档列表
     */
    public List<Archive> findArchiveNameAndArticleNum();


    /**
     * 归档:返回每年的所有文章
     */
    public List<Article> getArticlesByYearMonth(@Param("yearMonth") String yearMonth);

}

