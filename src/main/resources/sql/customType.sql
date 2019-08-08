DROP TABLE IF EXISTS customType;
CREATE TABLE customType(
  id int PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL COMMENT '文章分类的名称,自定义分类名称'
)DEFAULT CHARSET=utf8;

INSERT INTO customType(id, name) VALUES (1,'默认分类');

