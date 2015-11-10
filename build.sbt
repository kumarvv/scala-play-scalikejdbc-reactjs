lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .enablePlugins(SbtWeb)
  .settings(
    name := """employees-scala-play-scalikejdbc""",
    version := "1.0-SNAPSHOT",
    scalaVersion := "2.11.7",
    resolvers ++= Seq(
      "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases",
      "sonatype releases" at "http://oss.sonatype.org/content/repositories/releases"
    ),
    libraryDependencies ++= Seq(
      "org.scalikejdbc"      %% "scalikejdbc"                   % scalikejdbcVersion,
      "org.scalikejdbc"      %% "scalikejdbc-config"            % scalikejdbcVersion,
      "org.scalikejdbc"      %% "scalikejdbc-play-initializer"  % scalikejdbcPlayVersion,
      "org.scalikejdbc"      %% "scalikejdbc-play-fixture"      % scalikejdbcPlayVersion,
      "org.scalikejdbc"      %% "scalikejdbc-test"              % scalikejdbcVersion  % "test",
      "com.h2database"       %  "h2"                            % h2Version,
      "org.json4s"           %% "json4s-ext"                    % "3.2.11",
      "org.json4s"           %% "json4s-jackson"                % "3.2.11",
      "com.github.tototoshi" %% "play-json4s-native"            % "0.4.0",
      "org.flywaydb"         %% "flyway-play"                   % "2.0.1",
      "org.webjars" 		     %% "webjars-play" 		% "2.4.0-1",
      "org.webjars" 		     %  "bootstrap" 			% "3.1.1-2",
      "org.webjars" 		     %  "react" 				% "0.13.3",
      specs2 % "test",
      ws
    ),
    checksums := Nil,
    initialCommands := """
      import scalikejdbc._, config._
      import models._, utils._
      DBs.setupAll
      DBInitializer.run()
      implicit val autoSession = AutoSession
      val d = Dept.syntax("s")
      """,
    routesGenerator := InjectedRoutesGenerator,
      scalikejdbcSettings
  )

lazy val scalikejdbcVersion = "2.2.+"
lazy val scalikejdbcPlayVersion = "2.4.+"
lazy val h2Version = "1.4.+"
