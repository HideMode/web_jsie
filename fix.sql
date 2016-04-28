ALTER TABLE `web_jsie`.`authentication_account` 
ADD COLUMN `avatar` VARCHAR(200) NULL DEFAULT 'users/avatar.jpg' AFTER `updated_at`;

CREATE TABLE `web_jsie`.`authentication_account_course` (
  `id` INT NOT NULL,
  `account_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_authentication_account_course_1_idx` (`account_id` ASC),
  INDEX `fk_authentication_account_course_2_idx` (`course_id` ASC),
  CONSTRAINT `fk_authentication_account_course_1`
    FOREIGN KEY (`account_id`)
    REFERENCES `web_jsie`.`authentication_account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_authentication_account_course_2`
    FOREIGN KEY (`course_id`)
    REFERENCES `web_jsie`.`course_course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
ALTER TABLE `web_jsie`.`authentication_account_course` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;
