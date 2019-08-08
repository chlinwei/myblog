package lw.pers.myblog.service.impl;

import lw.pers.myblog.constant.RoleConstant;
import lw.pers.myblog.dao.CustomTypeDao;
import lw.pers.myblog.dao.UserDao;
import lw.pers.myblog.exception.MyException;
import lw.pers.myblog.exception.ResultEnum;
import lw.pers.myblog.model.Collect;
import lw.pers.myblog.model.CustomType;
import lw.pers.myblog.model.User;
import lw.pers.myblog.service.CollectService;
import lw.pers.myblog.service.UserService;
import lw.pers.myblog.util.AvatarlUtil;
import lw.pers.myblog.util.Md5;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private CustomTypeDao customTypeDao;
    @Autowired
    private CollectService collectService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private HttpServletRequest request;

    @Value("${ftp.host}")
    private String ftpHost;

    @Override
    public User findUserById(int id) {
        return userDao.getUserById(id);
    }

    @Override
    public User findUserByUserName(String userName) {
        User user = userDao.getUserByUserName(userName);
        if(user==null){
            throw new MyException("用户不存在");
        }
        return user;
    }

    @Override
    public Map<String, String> getUserInfo(String userName) {
        User userInfo = userDao.getUserInfo(userName);
        Map map = new HashMap<String,String>();
        map.put("id",userInfo.getId());
        map.put("userName",userInfo.getUserName());
        map.put("email",userInfo.getEmail());
        map.put("gender",userInfo.getGender());
        map.put("birthday",userInfo.getBirthday());
        map.put("personalBrief",userInfo.getPersonalBrief());
        map.put("sign",userInfo.getSign());
        map.put("phone",userInfo.getPhone());
        return map;
    }

    @Transactional
    @Override
    public void createUser(User user) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        //1.首先判断这个用户是否存在
        User u = userDao.getUserByUserName(user.getUserName());
        if(u!=null){
            throw new MyException(ResultEnum.USER_EXIST);
        }
        //2.插入用户
        user.setPasswd(Md5.encodeByMd5(user.getPasswd()));
        userDao.insertUser(user);
        //3.给用户设置角色
        userDao.insertRole(user.getId(), RoleConstant.ROLE_USER);
    }


    @Override
    public void updateAvatarImgUri(String userName, String avatarImgUri) {
        userDao.updateAvatarImgUriByUserName(userName,avatarImgUri);
    }

    @Override
    public String getAvatarImgUri(String userName) {
        return userDao.getAvatarImgUriByUserName(userName);
    }

    @Override
    public boolean userNameIsExist(String userName) {
        User user = userDao.getUserByUserName(userName);
        return user != null;
    }

    @Override
    public boolean userIsExist(int userId) {
        User user = userDao.getUserInfoById(userId);
        return user != null;
    }

    @Override
    public void updateUserInfo(User user,String oldName) {
        userDao.updateUserInfo(user,oldName);
    }

    @Override
    public void updatePasswd(String newPasswd, String userName) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        String pwd = Md5.encodeByMd5(newPasswd);
        userDao.updatePasswd(pwd,userName);
    }

    @Override
    public void updateLastLoginTime(int userId) {
        userDao.updateLastLoginTime(userId);
    }
}
