/**
草稿表,即未发布的文章存在于草稿表中
 */
DROP TABLE IF EXISTS `draft`;

CREATE TABLE `draft`(
  `id` int PRIMARY KEY  AUTO_INCREMENT,
  `articleTitle` VARCHAR(255) COMMENT '文章名',
  `articleContent` LONGTEXT COMMENT '文章内容',
  `articleTags` VARCHAR(255) COMMENT '文章标签,最多可以设置5个,每个以;分割,每个最大长度为20个字符',
  `articleType` int NOT NULL DEFAULT 1 COMMENT '1表示原创,2表示转载',
  `createTime` TIMESTAMP  NOT NULL  DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间,用varchar类型可以去掉.0',
  `updateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `summary` VARCHAR(1500) COMMENT '文章摘要,不填,默认为内容前200字',
  `customTypeId` INT COMMENT '文章类型的id,自定义的类型',
  `userId` int NOT NULL COMMENT '文章是属于哪个用户的'
) DEFAULT CHARSET=utf8;

