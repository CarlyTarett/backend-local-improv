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
    //  console.log(request.params.id);
    console.log("in the function")
    //console.log(id);

    // const typeId = request.params.id;

    //connection.query("SELECT * FROM Suggestions where typeId = ?",  [typeId], function (err, data) {
    //connection.query("SELECT * FROM Suggestions where typeId = 2", function (err, data) {
    connection.query("SELECT * FROM Suggestions", function (err, data) {

        if (err) {
            console.log("in the error with an error")

            response.status(500).json({
                error: err
            })
        }
        else {
            console.log("done the sql ALLLLL good")

            let j = Math.floor(Math.random() * data.length);
            response.status(200).json(

                {
                    // suggestion: j
                    //  suggestion: data[j].suggestion
                    suggestion: data
                });
        };
    });

});


app.get("/types", function (request, response) {

    connection.query("SELECT * FROM Types", function (err, data) {

        if (err) {
            response.status(500).json({
                error: err
            })
        }
        else {
            response.status(200).json(

                {
                    types: data
                });
        };
    });
});


// POST 

app.post("/suggestion", function (request, response) {

    const newSuggestion = request.body;
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

// PUT 
app.put("/suggestion/:id", function (request, response) {

    const id = request.params.id;

    // console.log("XXXXXXXXXXXXXupdateXXXXXXXXXXXXxx");
    // console.log("id is :   ");
    // console.log(id);
    // console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYy");

    connection.query("UPDATE Suggestions set favourite = true WHERE id=?", [id], function (err, data) {

        if (err) {
            response.status(500).json({
                error: err
            })
        }
        else {
            response.status(200).json({
                suggestion: data
            });
        };
    });

});

// DELETE

app.delete("/suggestion/:id", function (request, response) {

    const id = request.params.id;

    connection.query("Delete FROM Suggestions WHERE id = ?", [id], function (err, data) {
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
