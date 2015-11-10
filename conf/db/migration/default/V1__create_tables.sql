drop table if exists dept;
create sequence seq_dept_id start with 1;
create table dept (
  id bigint not null default nextval('seq_dept_id') primary key,
  name varchar(255) not null
);

insert into dept (name) values ('Features');
insert into dept (name) values ('Human Resources');
insert into dept (name) values ('Client Services');
insert into dept (name) values ('L3 Support');
insert into dept (name) values ('Network Engineering');
insert into dept (name) values ('System Operations');

drop table if exists emp;
create sequence seq_emp_id start with 1;
create table emp (
  id bigint not null default nextval('seq_emp_id') primary key,
  name varchar(255) not null,
  dept_id bigint
);

insert into emp (name, dept_id) values ('Edward Stark', 1);
insert into emp (name, dept_id) values ('John Snow', 1);
insert into emp (name, dept_id) values ('Jamie Lannister', 1);
insert into emp (name, dept_id) values ('Sansa Stark', 1);
insert into emp (name, dept_id) values ('Catelyn Stark', 3);
insert into emp (name, dept_id) values ('Joffrey Baratheon', 5);
insert into emp (name, dept_id) values ('Tyrion Lannister', 4);
insert into emp (name, dept_id) values ('Arya Stark', 5);
insert into emp (name, dept_id) values ('Daenerys Targaryen', 2);
insert into emp (name, dept_id) values ('Ramsay Bolton', 6);
