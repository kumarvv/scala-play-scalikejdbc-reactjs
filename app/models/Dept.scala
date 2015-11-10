package models

import scalikejdbc._

case class Dept(id: Long, name: String)

object Dept extends DAO[Dept] {
  override val entity: scalikejdbc.SQLSyntaxSupport[Dept] = Dept

  override val me: QuerySQLSyntaxProvider[SQLSyntaxSupport[Dept], Dept] = Dept.syntax("d")

  override def construct(d: SyntaxProvider[Dept])(rs: WrappedResultSet): Dept = {
    Dept(rs.long(d.resultName.id), rs.string(d.resultName.name))
  }
}
