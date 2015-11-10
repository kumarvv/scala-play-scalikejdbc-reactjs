package controllers

import com.github.tototoshi.play2.json4s.native.Json4s
import org.json4s.jackson.Serialization
import play.api.mvc._
import models._
import org.json4s._

class Depts extends Controller with Json4s {

  implicit val formats = DefaultFormats

  def all = Action {
    Ok(encodeJson("all" -> Dept.findAll()))
  }

  def find(id: Long) = Action {
    Ok(encodeJson(Dept.find(id)))
  }

  def create = Action(json) { implicit req =>
    val o = req.body.extract[Dept]
    val created = Dept.create('name -> o.name)
    Ok(encodeJson(created))
  }

  def update(id: Long) = Action(json) { implicit req =>
    Dept.find(id) match {
      case Some(d) =>
        val o = req.body.extract[Dept]
        val updated = Dept.save(id, 'name -> o.name)
        Ok(encodeJson(updated))
      case _ => NotFound
    }
  }

  def delete(id: Long) = Action {
    Dept.find(id) match {
      case Some(d) => Dept.remove(id); Ok
      case _ => NotFound
    }
  }

  def encodeJson(src: AnyRef): JValue = {
    implicit val formats = Serialization.formats(NoTypeHints)
    Extraction.decompose(src)
  }
}
