package lw.pers.myblog.model;

/**
 * 文章分类表:
 * 1个用户对应多个文章分类,
 * 多篇文章属于1个文章分类类型
 */
public class CustomType {
    private Integer id;
    //文章分类的的名称
    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

