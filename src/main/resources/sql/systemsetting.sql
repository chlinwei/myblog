DROP TABLE IF EXISTS systemsetting;

CREATE TABLE systemsetting(
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `key` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) NOT NULL
)DEFAULT CHARSET=utf8;

# INSERT systemsetting VALUES ('avatarUri','');


