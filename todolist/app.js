//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _= require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://ivinay718:alottodo@cluster0.5yrvv.mongodb.net/todolistDB");

const taskSchema = {
  task: String
}

const Task = mongoose.model(
  "task", taskSchema
);

const hang = new Task({
  task: "hang around the garden."
});

const sleep = new Task({
  task: "sleep for 1100 hrs."
});

const fly = new Task({
  task: "fly in the evening with birds."
}); 

const defaultItems = [hang, sleep, fly];

const listSchema = {
  listName: String,
  taskList: [taskSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  Task.find({}, (err, results)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(results);
      if(results.length == 0){
        Task.insertMany(defaultItems, (err)=>{
          if(err){
            console.log(err);
          }
          else{
            console.log("Default items were added to the collections successfully.");
            res.redirect("/");
          }
        });
      }
      else{
        console.log("The list is not empty.");
        res.render("list", {listTitle: "Today", newListItems: results});
      }
    }
  });
});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const listName = req.body.list; 

  const newTask = new Task({
    task: item
  });

  if(listName == "Today"){
    newTask.save();
    res.redirect("/");
  }

  else{
    List.findOne({listName: listName}, function(err, foundList){
      foundList.taskList.push(newTask);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
  
});

app.post("/delete", function(req, res){
  const taskId = req.body.checkbox;
  const listT = req.body.listTitle;

  if(listT === "Today"){
    Task.deleteOne({_id: taskId}, function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully deleted the task with id " + taskId);
      }
    });
    res.redirect("/");
  }

  else{
    List.findOneAndUpdate({listName: listT}, {$pull: {taskList: {_id: taskId}}}, function(err){
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/" + listT);
      }
    });
  }

  
});

app.get("/:listname", function(req, res){
  const customListName = _.capitalize(req.params.listname);

  List.findOne({"listName": customListName}, (err, results)=>{
    if(err){
      console.log(err);
    }
    else{
      if(!results){
        const defaultList = new List({
          listName: customListName,
          taskList: defaultItems
        });
        defaultList.save();
        res.redirect("/" + customListName);
        console.log("dosent exist");
      }
      else{
        console.log("exists");
        res.render("list",  {listTitle: customListName, newListItems: results.taskList});
      }
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
 
app.listen(port, function() {
  console.log("Server started succesfully");
});
