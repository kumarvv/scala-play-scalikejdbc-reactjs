package models

import scalikejdbc._

trait DAO[T] extends SQLSyntaxSupport[T] {

  /**
    * default constructor - should be overloaded with additional syntax providers when joins are involved
    */
  def construct(e: SyntaxProvider[T])(rs: WrappedResultSet): T

  /**
    * entity object implementing DAO[T]
    */
  val entity: SQLSyntaxSupport[T]
  /**
    * current entity SyntaxProvider
    */
  val me: QuerySQLSyntaxProvider[SQLSyntaxSupport[T], T]
  /**
    * map to current constructor
    */
  val mappings: (WrappedResultSet => T) = construct(me)
  /**
    * default where clause used in select, update and delete
    */
  val whereClause: Option[SQLSyntax] = None
  /**
    * default orderBy clause for selects
    */
  val orderByColumns: Seq[SQLSyntax] = Nil

  /**
    * joins
   */
  case class Join[J](
      mode: Symbol,
      dao: DAO[J],
      fk: SQLSyntax,
      refPk: SQLSyntax
  )
  val joins: Seq[Join[_]] = Nil

  /**
    * helper join methods for leftJoin, rightJoin, join (inner)
    */
  def join[J](dao: DAO[J], fk: SQLSyntax, refPk: SQLSyntax): Join[J] = Join('join, dao, fk, refPk)
  def joinLeft[J](dao: DAO[J], fk: SQLSyntax, refPk: SQLSyntax): Join[J] = Join('left, dao, fk, refPk)
  def joinRight[J](dao: DAO[J], fk: SQLSyntax, refPk: SQLSyntax): Join[J] = Join('right, dao, fk, refPk)

  /**
    * constructors
    */
  def apply(sp: SyntaxProvider[T])(rs: WrappedResultSet): T = apply(sp.resultName)(rs)
  def apply(rn: ResultName[T])(rs: WrappedResultSet): T = construct(me)(rs)

  /**
    * helper to convert symbols to scalikejdbc columnsAndValues
    */
  private def columnsAndValues(params: (Symbol,Any)*) = params.map(p => SQLSyntax.createUnsafely(p._1.name) -> p._2)

  /**
    * helper to build select sql with dynamic joins - supports count sql as well
    * can be overridden to support custom requirement of implementing entity
    */
  def buildSelectSql(count: Boolean = false) = {
    val sql = {
      if (count)
        select(sqls.count).from(entity as me)
      else
        select.from[T](entity as me)
    }
    sql.map(sql => {
        // build joins
        var sqlv = sql
        for(j <- joins) {
          j.mode match {
            case 'left => sqlv = sqlv.leftJoin(j.dao.entity as j.dao.me).on(j.fk, j.refPk)
            case 'right => sqlv = sqlv.rightJoin(j.dao.entity as j.dao.me).on(j.fk, j.refPk)
            case 'join => sqlv = sqlv.join(j.dao.entity as j.dao.me).on(j.fk, j.refPk)
          }
        }
        sqlv
      })
  }

  /**
    * find all rows
    */
  def findAll()(implicit session: DBSession = autoSession): List[T] = {
    val sql = withSQL {
      buildSelectSql()
        .where(whereClause)
        .orderBy(orderByColumns: _*)
    }
    sql.map(mappings).list().apply()
  }

  /**
    * find all rows by custom where clause
    */
  def findBy(where: SQLSyntax, params: (Symbol, Any)*)(implicit session: DBSession = autoSession): List[T] = {
    val sql = withSQL {
      buildSelectSql().where.append(where).and(whereClause)
    }
    sql.bindByName(params: _*).map(mappings).list().apply()
  }

  /**
    * find by specific id
    */
  def find(id: Long)(implicit session: DBSession = autoSession): Option[T] = {
    val sql = withSQL {
      buildSelectSql().where.eq(me.id, id).and(whereClause)
    }
    sql.map(mappings).single().apply()
  }

  /**
    * count all rows
    */
  def countAll()(implicit session: DBSession = autoSession): Long = {
      withSQL {
        buildSelectSql(true).where(whereClause)
      }.map(rs => rs.long(1)).single().apply().get
  }

  /**
    * count all rows for given where clause
    */
  def countBy(where: SQLSyntax, params: (Symbol, Any)*)(implicit session: DBSession = autoSession): Long = {
    val sql = withSQL {
      buildSelectSql(true).where.append(where).and(whereClause)
    }
    sql.bindByName(params: _*).map(rs => rs.long(1)).single().apply().get
  }

  /**
    * create row
    */
  def create(params: (Symbol, Any)*)(implicit session: DBSession = autoSession): T = {
      val id = withSQL {
        insert.into(entity)
          .namedValues(columnsAndValues(params: _*): _*)
      }.updateAndReturnGeneratedKey.apply()
      find(id).get;
  }

  /**
    * update row
    */
  def save(id: Long, params: (Symbol, Any)*)(implicit session: DBSession = autoSession): T = {
    withSQL {
      update(entity).set(columnsAndValues(params: _*): _*).where.eq(sqls"id", id)
    }.update().apply()
    find(id).get
  }

  /**
    * remove row
    */
  def remove(id: Long)(implicit session: DBSession = autoSession): Boolean = {
    find(id) match {
      case Some(e) => {
        withSQL {
          delete.from(entity as me)
            .where.eq(me.id, id)
        }.update().apply()
        true
      }
      case _ => false
    }
  }

}
