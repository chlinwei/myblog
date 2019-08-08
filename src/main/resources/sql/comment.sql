DROP TABLE IF EXISTS `comment`;
/**
文章的评论表
 */
CREATE TABLE `comment`(
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `topicType` int NOT NULL COMMENT '主题类型,1:文章',
  `topicId` int NOT NULL COMMENT '例如,主题类型为文章,则这里的topicId表示文章id',
  `pId`  int DEFAULT 0 NOT NULL COMMENT '回复的父id,若果是评论则为0,如果是回复则对对应的评论id',
  `content` text NOT NULL COMMENT '评论的内容',
  `fromUid` int NOT NULL COMMENT '评论者id',
  `toUid` int DEFAULT 0 COMMENT '被回复者id,如果是评论,没有被回复者,则为0',
  `floor` int DEFAULT 0 COMMENT '楼层,如果是评论则有楼层,是回复,则没有楼层',
  `createTime` TIMESTAMP  NOT NULL  DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间,用varchar类型可以去掉.0'
) DEFAULT CHARSET=utf8;


