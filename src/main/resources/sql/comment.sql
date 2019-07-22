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
  `createTime` VARCHAR(20)  NOT NULL  DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间,用varchar类型可以去掉.0'
) DEFAULT CHARSET=utf8;
/**
10条评论
 */
INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
    1,1,'评论1',1,1);

INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
  1,1,'评论2',2,2);

INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
1,1,'评论3',3,3);

INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
1,1,'评论4',4,4);

INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
1,1,'评论5',1,5);

INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
1,1,'评论6',1,6);

INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
 1,1,'评论7',2,7);


INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
1,1,'评论8',2,8);

INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
1,1,'评论9',2,9);

INSERT INTO comment(topicType,topicId,   content, fromUid,floor) VALUES (
1,1,'评论10',2,10);


/**
给第1条评论加上回复
用户2回复用户1
 */
INSERT INTO comment(topicType,topicId,   pId, content, fromUid, toUid) VALUES (
   1, 1,1,'回复1',2,1);

/**
用户3回复用户2
 */
INSERT INTO comment(topicType,topicId,   pId, content, fromUid, toUid) VALUES (
 1, 1,1,'回复2',3,2);

/**
用户1回复用户2
 */
INSERT INTO comment(topicType,topicId,   pId, content, fromUid, toUid) VALUES (
 1, 1,1,'回复3',1,2);

/**
用户1回复用户3
 */
INSERT INTO comment(topicType,topicId,   pId, content, fromUid, toUid) VALUES (
  1,1,1,'回复4',1,3);

/**
用户1回复评论
 */
INSERT INTO comment(topicType,topicId,   pId, content, fromUid, toUid) VALUES (
 1, 1,1,'回复4',1,0);


/**
用户1评论第11条
 */
INSERT INTO comment(topicType,topicId, content, fromUid, floor) VALUES (
1,1,'hahah',1, (select floor from (select count(*)+1 as floor  from comment where topicType=1 and topicId=1 and pId=0) as t));


