//require/import all the required npm modules.

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//create a new instance of express app.
const app = express();

//set the apps view engine to ejs.
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//connect to mongoDB - wikiDB.
mongoose.connect("mongodb://localhost:27017/wikiDB");


//create a new model Article with scheme articleSchema.
const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("article", articleSchema);


app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/public/Untitled-1.html");
});


app.route("/articles")

    .get((req, res)=>{
        Article.find({}, (err, results)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send(results);
            }
        });
    })

    .post((req, res)=>{
        const newArticleTitle = req.body.title;
        const newArticleContent = req.body.content;
        
        const newArticle = new Article({
            title: newArticleTitle,
            content: newArticleContent
        });
    
        newArticle.save((err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully added a new Article.");
            }
        });
    })

    .delete((req, res)=>{
        Article.deleteMany({}, (err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully deleted all the articles.");
            }
        });
    });


app.route("/articles/:topic")

    .get((req, res)=>{
        Article.findOne(
            {title: req.params.topic},
            (err, foundArticle)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send(foundArticle);
            }
        })
    })

    .put((req, res)=>{
        Article.updateOne(
            {title: req.params.topic},
            {title: req.body.title, content: req.body.content},
            (err)=>{
                if(err){
                    console.log("error occured");
                    res.send(err);
                }
                else{
                    res.send("Successfully replaced the article");
                }
            })
    })

    .patch((req, res)=>{
        Article.updateOne(
            {title: req.params.topic},
            {$set: req.body},
            (err)=>{
                if(err){
                    res.send(err);
                }
                else{
                    res.send("Successfully patched the article");
                }
            }
        )
    })

    .delete((req, res)=>{
        Article.deleteOne({title: req.params.topic}, (err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully deleted the article");
            }
        })
    });


app.listen(3000, ()=>{
    console.log("server started at port 3000.");
});