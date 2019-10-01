package lw.pers.myblog.dao;

import lw.pers.myblog.model.Friendlylink;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface FriendlylinkDao {
    /**
     * 查询所有链接
     */
    public List<Friendlylink> getAll();

    /**
     * 添加一条链接
     */
    public void addOne(@Param("name")String name,@Param("url")String url);

    /**
     *修改链接
     */
    public void updateOne(@Param("id")int id,@Param("name")String name,@Param("url")String url);

}