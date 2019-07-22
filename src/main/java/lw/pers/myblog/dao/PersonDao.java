package lw.pers.myblog.dao;

import lw.pers.myblog.model.Person;
import org.apache.ibatis.annotations.Param;

public interface PersonDao {
    public Person getOne(@Param("id") int id);
}
