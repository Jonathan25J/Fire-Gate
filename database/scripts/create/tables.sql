CREATE TABLE discord_user (
  id bigint NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE spirit (
  name           varchar(255) NOT NULL, 
  avatar         varchar(255), 
  color          varchar(7),
  discord_user_id bigint NOT NULL, 
  PRIMARY KEY (name));
ALTER TABLE spirit ADD CONSTRAINT FKspirit953754 FOREIGN KEY (discord_user_id) REFERENCES discord_user (id);
