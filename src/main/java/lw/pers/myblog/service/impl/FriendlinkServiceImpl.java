package lw.pers.myblog.service.impl;

import lw.pers.myblog.dao.FriendlinkDao;
import lw.pers.myblog.model.Friendlink;
import lw.pers.myblog.service.FriendlinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendlinkServiceImpl implements FriendlinkService{
    @Autowired
    private FriendlinkDao friendlinkDao;
    @Override
    public List<Friendlink> getAll() {
        return friendlinkDao.getAll();
    }
}
