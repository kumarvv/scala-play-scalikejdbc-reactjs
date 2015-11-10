package utils

import scalikejdbc._
object DBInitializer {
  def run() {
    print("running DBInitializer.run()...")
    DB readOnly { implicit s =>
      try {
        sql"select 1 from dept limit 1".map(_.long(1)).single.apply()
      } catch {
        case e: java.sql.SQLException =>
          DB autoCommit { implicit s =>
            sql"""
create sequence seq_dept_id start with 1;
create table dept (
  id bigint not null default nextval('seq_dept_id') primary key,
  name varchar(255) not null
);

insert into dept (name) values ('Features');
insert into dept (name) values ('Human Resources');
insert into dept (name) values ('Client Services');
insert into dept (name) values ('Customer Support');
insert into dept (name) values ('Management');
insert into dept (name) values ('Network Operations');
            """.execute.apply()
            print("DBInitializer.run() done!!!")
          }
      }
    }
  }

}

