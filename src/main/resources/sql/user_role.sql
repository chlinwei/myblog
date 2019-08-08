DROP TABLE IF EXISTS user_role;
CREATE TABLE user_role(
  userId int NOT NULL COMMENT '用户id',
  roleId int NOT NULL COMMENT '角色id'
)DEFAULT CHARSET=utf8;


INSERT INTO user_role(userId,roleId)VALUES (1,1);
INSERT INTO user_role(userId,roleId)VALUES (1,2);

