package lw.pers.myblog.service;

import java.util.List;
import java.util.Map;

public interface VisitorService {
    /**
     * 返回某个用户的最近访问列表
     */
    public List<Map<String,Object>> getVisitors(int userId);

    /**
     * 跟新最近访问列表
     */
    public void updateVisitor(int visitorId, int userId);
}
