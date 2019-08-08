package lw.pers.myblog.dao;

import lw.pers.myblog.model.Comment;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CommentDao {
    /**
     *返回一个主题id下的所有评论,不包含回复
     */
    List<Comment> getAllComments(@Param("topicType")int topicType,@Param("topicId") int topicId);

    /**
     * 获取最新评论
     */
    List<Comment> getLatestComments();

    /**
     * 获取评论总的数目
     */
    public int countComment();

    /**
     * 根据主题id,返回所有评论和回复数的和
     */

    int countCommentByTopicId(@Param("topicType")int topicType,@Param("topicId") int topicId);


    /**
     *根据一个评论id,返回对应的所有回复
     */
    List<Comment> getReplies(@Param("pId") int pId);

    /**
     * 根据一个评论id,返回对应得所有回复id
     */
    List<Integer> getReplyIdsByPid(@Param("pId") int pId);

    /**
     删除一个回复或者评论,如果是删除评论,则不会删除相关的回复
     */
    void delOne(@Param("id") int id, @Param("fromUid") int fromUid);

    /**
     * 删除一个评论下的所有回复
     */
    void delRepliesBypId(@Param("pId") int pId);

    /**
     * 根据id和fromUid,返回一个Comment
     */
    Comment getComment(@Param("id") int id, @Param("fromUid") int fromUid);

    /**
     * 添加一条评论
     */
    void insertComment(@Param("comment") Comment comment);

    /**
     * 添加一条回复
     */
    void insertReply(@Param("comment") Comment comment);

    /**
     * 根据主题id来删除相关得comment
     */
    void delCommentsByArticleId(@Param("topicType")int topicType,@Param("topicId") int topicId);

}

