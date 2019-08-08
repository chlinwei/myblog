package lw.pers.myblog.service.impl;

import lw.pers.myblog.dao.LikeDao;
import lw.pers.myblog.exception.MyException;
import lw.pers.myblog.exception.ResultEnum;
import lw.pers.myblog.model.Like;
import lw.pers.myblog.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeServiceImpl implements LikeService{
    @Autowired
    private LikeDao likeDao;
    @Override
    public int getLikes(int typeId, int type) {
        return likeDao.getLikes(typeId,type);
    }

    @Override
    public boolean isLiked(int typeId, int type, int userId) {
        Like like = likeDao.getLike(typeId, type, userId);
        return like != null;
    }

    @Override
    public void insertLike(int typeId,int ownerId,int type, int userId) {
        boolean flag = this.isLiked(typeId, type, userId);
        if(!flag){
            //表示还没有点赞
            likeDao.insertLike(typeId,ownerId,type,userId);
        }else{
            //已经点赞了
            throw new MyException(ResultEnum.DATA_EXIST);
        }
    }

    @Override
    public void undoLike(int typeId, int type, int userId) {
        likeDao.delLike(typeId,type,userId);
    }

    @Override
    public void delLikesByArticleId(int typeId, int type) {
        likeDao.delLikesByArticleId(typeId,type);
    }

}
