package lw.pers.myblog.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lw.pers.myblog.dao.CustomTypeDao;
import lw.pers.myblog.dao.DraftDao;
import lw.pers.myblog.model.Article;
import lw.pers.myblog.model.CustomType;
import lw.pers.myblog.service.ArticleService;
import lw.pers.myblog.service.DraftService;
import lw.pers.myblog.util.ArticleUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DraftServiceImpl implements DraftService {

    @Autowired
    private DraftDao draftDao;

    @Autowired
    private CustomTypeDao customTypeService;

    @Autowired
    private ArticleService articleService;
    @Override
    public Map<String,Object> getDraftList(int pageNum, int pageSize) {
        Map returnValue = new HashMap<String,Object>();
        List list = new ArrayList<Map<String,Object>>();
        Page page = PageHelper.startPage(pageNum,pageSize);
        draftDao.getDraftList();
        PageInfo<Article> pageInfo = new PageInfo<Article>(page);
        List<Article> drafts = pageInfo.getList();
        returnValue.put("pageNum",pageInfo.getPageNum());
        returnValue.put("pageSize",pageInfo.getPageSize());
        returnValue.put("pages",pageInfo.getPages());
        returnValue.put("total",pageInfo.getTotal());
        for(Article draft:drafts){
            Map map = new HashMap<String,Object>();
            map.put("id",draft.getId());
            map.put("articleTitle",draft.getArticleTitle());
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String updateTimeStr = format.format(draft.getUpdateTime());
            map.put("updateTime",updateTimeStr);
            list.add(map);
        }
        returnValue.put("list",list);
        return returnValue;
    }

    @Override
    public void delOne(int id) {
        draftDao.delOne(id);
    }


    @Override
    @Transactional
    public void delMany(int[] ids) {
        for(int id:ids){
            delOne(id);
        }
    }

    @Override
    public void saveDraft(Article article) {
        draftDao.saveDraft(article);
    }

    @Override
    public void updateDraft(Article article) {
        draftDao.updateDraft(article);
    }

    @Override
    @Transactional
    public void pubDraft(Article article) {
        //1.先删除草稿
        if(article.getId()!=null) {
            draftDao.delOne(article.getId());
        }
        //2.在创建文章
        articleService.saveArticle(article);
    }

    @Override
    public Map<String, Object> getOne(int id) {
        Article article = draftDao.getOne(id);
        CustomType customType = null;
        if(article.getCustomTypeId()!=null) {
            customType = customTypeService.getCutomTypeById(article.getCustomTypeId());
        }
        Map<String,Object> map = new HashMap<>();
        map.put("id",article.getId());
        map.put("articleType",article.getArticleType());
        map.put("articleTitle",article.getArticleTitle());

        ArticleUtil.addContextPathInContent(article);
        map.put("articleContent",article.getArticleContent());

        if(customType!=null) {
            map.put("customTypeId", article.getCustomTypeId());
            map.put("customTypeName", customType.getName());
        }
        map.put("summary",article.getSummary());
        map.put("articleTags",article.getArticleTags());
        return map;
    }

    @Override
    public boolean draftIsExist(int draftId) {
        return draftDao.getOne(draftId)!=null;
    }

    @Transactional
    @Override
    public Map<String, Object> getDraftAndCustomTypes(int id) {
        Map<String,Object> map = this.getOne(id);
        List<CustomType> customTypes = customTypeService.getAll();
        map.put("customTypes",customTypes);
        return map;
    }
}


