const express = require("express");
const cors = require("cors");
const serverlessHttp = require("serverless-http");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "improv"
});

// GET /tasks

app.get("/suggestion", function (request, response) {

    connection.query("SELECT * FROM Suggestions", function (err, data) {
        if (err) {
            response.status(500).json({
                error: err
            })
        }
        else {
            response.status(200).json({
                suggestions: data
            });
        };
    });

});


// POST /developers

app.post("/suggestion", function (request, response) {

    const newSuggestion = request.body;

    console.log("XXXXXXXXXXXXdoing A CREATE XXXXXXXXXXXxx");
    connection.query("INSERT INTO Suggestions SET ?", [newSuggestion], function (err, data) {

        if (err) {
            response.status(500).json({
                error:
                    err
            })
        }
        else {
            newSuggestion.id = data.insertId;
            response.status(201).json(newSuggestion);
        }
    });

});

// PUT /developers
app.put("/tasks/:id", function (request, response) {

    const updatedTask = request.body;
    const id = request.params.id;

    console.log("XXXXXXXXXXXXXupdateXXXXXXXXXXXXxx");
    console.log("id is :   ");
    console.log(id);
    console.log(updatedTask);

    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYy");

    connection.query("UPDATE task SET ? WHERE id=?", [updatedTask, id], function (err, data) {

        if (err) {
            response.status(500).json({
                error: err
            })
        }
        else {
            response.status(200).json({
                developers: data
            });
        };
    });

});

// DELETE /developers

app.delete("/tasks/:id", function (request, response) {

    const id = request.params.id;


    console.log("XXXXXXXXXXXXXdeleteXXXXXXXXXXXxx");
    console.log("id is :   ");
    console.log(id);


    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYy");


    //connection.query("Delete FROM task WHERE id = 36", function(err, data){

    connection.query("Delete FROM task WHERE id = ?", [id], function (err, data) {
        //connection.query("INSERT INTO comments (comment) values ( ?)", [id], function(err, data){

        if (err) {
            response.status(500).json({
                error: err
            })
        }
        else {
            response.sendStatus(200);
        };

    });

});

module.exports.app = serverlessHttp(app);
