package controllers

import com.github.tototoshi.play2.json4s.native.Json4s
import models._
import org.json4s._
import org.json4s.jackson.Serialization
import play.api.mvc._

class Emps extends Controller with Json4s {

  implicit val formats = DefaultFormats

  def all = Action { implicit req =>
    val data = Map(
      "all" -> Emp.findAll(),
      "depts" -> Dept.findAll())
    Ok(encodeJson(data))
  }

  def find(id: Long) = Action {
    Ok(encodeJson(Emp.find(id)))
  }

  def create = Action(json) { implicit req =>
    val o = req.body.extract[Emp]
    val created = Emp.create('name -> o.name, 'dept_id -> o.deptId)
    Ok(encodeJson(created))
  }

  def update(id: Long) = Action(json) { req =>
    Emp.find(id) match {
      case Some(d) => {
        val updated = Emp.save(id,
          'name -> (req.body \ "name").extract[String],
          'dept_id -> (req.body \ "deptId").extract[Long])
        Ok(encodeJson(updated))
      }
      case _ => NotFound
    }
  }

  def delete(id: Long) = Action {
    Emp.find(id) match {
      case Some(d) => Emp.remove(id); Ok
      case _ => NotFound
    }
  }

  def encodeJson(src: AnyRef): JValue = {
    implicit val formats = Serialization.formats(NoTypeHints)
    Extraction.decompose(src)
  }

}
