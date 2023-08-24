//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash"); 

const homeStartingContent = "Welcome to Daily Journal, your go-to destination for journey. Explore a world of insightful articles, captivating videos, and inspiring podcasts that dive deep into the topics you're passionate about. Whether you're a seasoned enthusiast or just starting your journey, our carefully curated content offers something for everyone. Join our thriving community of like-minded individuals and stay up-to-date with the latest trends, expert insights, and practical tips. We're here to empower, educate, and entertain you on every step of your adventure. Ready to embark on a path of discovery? Start exploring now!";
const aboutContent = "Welcome to Daily Journal, your go-to destination for Journey. Explore a world of insightful articles, captivating videos, and inspiring podcasts that dive deep into the topics you're passionate about. Whether you're a seasoned enthusiast or just starting your journey, our carefully curated content offers something for everyone. Join our thriving community of like-minded individuals and stay up-to-date with the latest trends, expert insights, and practical tips. We're here to empower, educate, and entertain you on every step of your adventure. Ready to embark on a path of discovery? Start exploring now!";
const contactContent = "We're excited to hear from you! Whether you have a question, a suggestion, or just want to say hello, don't hesitate to reach out. Feel free to drop us a line at dailyjournal@gmail.com, and you can also connect with us on Social Media Platforms for updates, discussions, and more. Your feedback and engagement mean the world to us as we continue to create content that matters to you. Let's stay connected and keep the conversation going!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

// home page
app.get("/", function(req,res){
  
  res.render("home",{
    home_content : homeStartingContent,
    posts : posts
  });
});

// about us page
app.get("/about",function(req,res){
  res.render("about",{
    aboutUs : aboutContent
  })
});

// contact us page
app.get("/contact",function(req,res){
  res.render("contact",{
    contactUs : contactContent
  })
});

//compose page
app.get("/compose",function(req,res){
  res.render("compose")
});

app.post("/compose",function(req,res){
  const post = {
    title : req.body.titleBody,
    content : req.body.postBody
  };
  posts.push(post);

  res.redirect("/");
});

app.get("/posts/:postName" ,function(req,res){
  const requestedTitle = _.lowerCase(req.params.postName);
  
  posts.forEach(function(post){
    const postTitle = _.lowerCase(post.title); // used lodash here 
    if(postTitle === requestedTitle){
      res.render("post",{
        title : post.title,
        content : post.content
      });
    }
    else{
      console.log("match not found!");
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
