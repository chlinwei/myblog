/**
友情链接
 */
DROP TABLE IF EXISTS `friendlink`;

CREATE TABLE `friendlink`(
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(60) COMMENT '名称',
  `url` VARCHAR(100) COMMENT '网址'
) DEFAULT CHARSET=utf8;


INSERT INTO `friendlink` VALUES (1,'张海洋博客','https://www.zhyocean.cn/');
INSERT INTO `friendlink` VALUES (2,'曾中杰博客','https://www.zengzhongjie.com/');

