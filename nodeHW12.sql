CREATE database employees;
USE employees;

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
deptName VARCHAR(30),
PRIMARY KEY (id)
);

CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL(10, 2),
department_id INT,
PRIMARY KEY (id),
foreign key (department_id) references department(id)
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(40),
last_name VARCHAR (40),
role_id INT,
manager_id INT,
PRIMARY KEY (id),
foreign key (role_id) references roles(id)
);