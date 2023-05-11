const express=require('express');
const path=require('path');
const fs=require('fs');
const app=express();

const directory=path.join(__dirname, "/public");
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.get("/notes", function(request, response){
    response.sendFile(path.join(directory,"notes.html"));
});
app.get("/api/notes", function(request, response){
    response.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(resquest, response){
    const dataBase = JSON.parse (fs.readFileSync("./db/db.json", "utf8"));
    response.json(dataBase[Number(request.params.id)]);
});

app.get("*", function (request, response){
    response.sendFile(path.join(directory, "index.html"));
});

app.post("/api/notes", function(request, response){
    let dataBase = JSON.parse (fs.readFileSync("./db/db.json", "utf8"));
    var note = request.body;
    const id = dataBase.length.toString();
    note.id = id;
    dataBase.push(note);
    fs.writeFileSync("./db/db.json", JSON.stringify(dataBase));
    response.json(dataBase);
});

app.delete("/api/notes/:id", function(request, response){
    let dataBase = JSON.parse (fs.readFileSync("./db/db.json", "utf8"));
    let currentId = request.params.id;
    let newId=0;
    dataBase = dataBase.filter(note=>{
        return currentId != note.id;
    });

    for(note of dataBase){
        note.id = newId;
        newId+= 1;
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(dataBase));
    response.json(dataBase);
});

const port=8080;
app.listen(port, function(){

});