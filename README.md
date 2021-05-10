== Neo4j Backend: Quick Start

This example application demonstrates how easy it is to get started with http://neo4j.com/developer[Neo4j] in JavaScript.


These are the components of our Web Application:

* Application Type:         JavaScript Application
* Neo4j Database Connector: https://github.com/neo4j/neo4j-javascript-driver[Neo4j JavaScript Driver] for Cypher https://neo4j.com/developer/javascript[Docs]
* Database:                 Neo4j-Server (4.x) with multi-database

== Quickstart

=== Setup

[source,bash]
----
$ npm install
----

=== Run locally

* Start Neo4j (https://neo4j.com/download[Download & Install]) locally and open the http://localhost:7474[Neo4j Browser].
* Install the dataset with `:play neo4j`, click the statement, and hit the triangular "Run" button.

[source,bash]
----
# run in development mode (refreshes the app on source code changes)
$ npm start

==== Configuration options

[%header,cols=2*]
|===

|PORT
|3000

|NEO4J_URI
|bolt://localhost:7687

|NEO4J_USER
|neo4j

|NEO4J_PASSWORD
|admin

|NEO4J_DATABASE
|neo4j
|===
