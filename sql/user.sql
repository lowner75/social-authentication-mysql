CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `password` varchar(512) DEFAULT NULL,
  `provider` varchar(20) DEFAULT NULL,
  `google_id` varchar(30) DEFAULT NULL,
  `google_img` varchar(255) DEFAULT NULL,
  `facebook_id` varchar(30) DEFAULT NULL,
  `facebook_img` varchar(255) DEFAULT NULL,
  `user_active` tinyint NOT NULL DEFAULT '0',
  `user_admin` tinyint NOT NULL DEFAULT '0',
  `background` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='	'