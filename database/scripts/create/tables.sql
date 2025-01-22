CREATE TABLE discord_user (
  id BIGSERIAL NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE gate (
  name            varchar(255) NOT NULL, 
  discord_user_id int8 NOT NULL, 
  PRIMARY KEY (name));
CREATE TABLE gateway (
  discord_user_id int8 NOT NULL, 
  gate_name        varchar(255) NOT NULL, 
  spirit_name      varchar(255) NOT NULL, 
  PRIMARY KEY (discord_user_id));
CREATE TABLE spirit (
  name            varchar(255) NOT NULL, 
  avatar          varchar(255), 
  color           varchar(7), 
  discord_user_id int8 NOT NULL, 
  PRIMARY KEY (name));
ALTER TABLE gate ADD CONSTRAINT FKgate918489 FOREIGN KEY (discord_user_id) REFERENCES discord_user (id);
ALTER TABLE gateway ADD CONSTRAINT FKgateway634002 FOREIGN KEY (discord_user_id) REFERENCES discord_user (id);
ALTER TABLE gateway ADD CONSTRAINT FKgateway568806 FOREIGN KEY (gate_name) REFERENCES gate (name);
ALTER TABLE gateway ADD CONSTRAINT FKgateway888973 FOREIGN KEY (spirit_name) REFERENCES spirit (name);
ALTER TABLE spirit ADD CONSTRAINT FKspirit953754 FOREIGN KEY (discord_user_id) REFERENCES discord_user (id);
