//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { text } = require("body-parser");
const lodash = require("lodash");
const mongoose = require("mongoose");
const { system } = require("nodemon/lib/config");
require('dotenv').config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const usn = process.env.USER_N;
const pwd = process.env.PASS_D;
const url = 'mongodb+srv://' + usn +  ':' + pwd + '@cluster0.5yrvv.mongodb.net/postDB';
console.log(url);
mongoose.connect(url);
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  postId: String
});

const Post = mongoose.model("Post", postSchema);

const post1 = new Post({
  title: "Post 4",
  content: "This is the fourth post"
});

var posts = [];

async function getPosts(){
  const query = await Post.find({});
  return query;
}

async function updatePosts(){
  const postsin = await getPosts();
  posts = [];
  console.log(postsin[0].postId);
  for(var key in postsin){
    if(postsin.hasOwnProperty(key)){
      console.log(key, postsin[key].postId);
      const post = {
        postTitle: postsin[key].title,
        postBody: postsin[key].content,
        postId: postsin[key].postId
      };
      // console.log(posts.indexOf(post));
      // if(posts.indexOf(post) == -1){
      // posts.push(post);
      // console.log('aa', posts, 'bb');
      // }
      posts[key] = post;
      // console.log(posts);
    }
  }
  console.log("a", posts);
}

// for(const doc in query){
//   // console.log(doc);
//   const post = {
//     postTitle: doc.title,
//     postBody: doc.content,
//     postId: lodash.toLower(doc.title)
//   };
  // console.log("post", post, "post");
  // posts.push(post);
// };
// updatePosts();

console.log(posts);


app.get("/", (req, res) => {
  updatePosts();
  console.log("inside", posts);
  res.render("home", {homeContent: homeStartingContent, postsList: posts});
});

app.get("/about", (req, res) => {
  res.render("about", {aboutContent: aboutContent});
});


app.get("/contact", (req, res) => {
  res.render("contact", {contactContent: contactContent});
});

// app.get("/compose", (req, res) => {
//   res.render("compose");
// });

app.get("/posts/:topic", (req, res) => {
  const topic = req.params.topic;
  console.log(topic);
  for(var i=0; i<posts.length; i++){
    if(posts[i].postId == topic){
      console.log("ispresent");
      res.render("post", {postTitle: posts[i].postTitle,
                          postBody: posts[i].postBody});
                      
    }
  }
});

app.post("/compose", (req, res) =>{
  const postTitle = req.body.composeTitle;
  const postBody  = req.body.composeContent;
  var postId = lodash.toLower(postTitle);
  postId = lodash.kebabCase(postId);
  const post = {
    postTitle : req.body.composeTitle,
    postBody  : req.body.composeContent,
    postId: postId
  };

  const post1 = new Post({
    title: postTitle,
    content: postBody,
    postId: postId
  });
  post1.save();
  // console.log(posts);
  res.redirect("/");
});

app.get("/auth", (req, res) => {
  res.render("auth");
});

app.post("/auth", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  if(username === "admin" && password === "admin"){
    console.log("success");
    res.render("compose");
  }
  else{
    res.redirect("/auth");
  }
});

app.get("/delete", (req, res) => {
  res.render("delete", {postsList: posts});
});

app.post("/delete", (req, res) => {
  console.log(req.body.postcheck);
  let delId = req.body.postcheck;
  if(delId == undefined){
    console.log("no posts to delete");
    res.redirect("/");
  }
  else{
    for(var i=0; i<delId.length; i++){
      console.log(delId[i]);
      const st = Post.findOneAndDelete({postId: delId[i]}).then((result) => {console.log(result);});
      // console.log("deleted ",st);
    }
    res.redirect("/");
  }
});

app.post("/rendel", (req, res) => {
  res.redirect("/delete");
});



app.listen( 3000 || system.process.PORT, function() {
  console.log("Server started on port 3000");
});
