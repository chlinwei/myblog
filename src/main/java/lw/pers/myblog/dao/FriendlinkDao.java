package lw.pers.myblog.dao;

import lw.pers.myblog.model.Friendlink;

import java.util.List;

public interface FriendlinkDao{
    /**
     * 查询所有链接
     */
    public List<Friendlink> getAll();

}