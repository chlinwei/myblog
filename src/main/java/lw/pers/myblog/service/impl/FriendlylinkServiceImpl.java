package lw.pers.myblog.service.impl;

import lw.pers.myblog.dao.FriendlylinkDao;
import lw.pers.myblog.model.Friendlylink;
import lw.pers.myblog.service.FriendlylinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendlylinkServiceImpl implements FriendlylinkService {
    @Autowired
    private FriendlylinkDao friendlylinkDao;
    @Override
    public List<Friendlylink> getAll() {
        return friendlylinkDao.getAll();
    }
}
