//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require('mysql2');

const homeStartingContent = "Welcome to Daily Journal, your go-to destination for journey. Explore a world of insightful articles, captivating videos, and inspiring podcasts that dive deep into the topics you're passionate about. Whether you're a seasoned enthusiast or just starting your journey, our carefully curated content offers something for everyone. Join our thriving community of like-minded individuals and stay up-to-date with the latest trends, expert insights, and practical tips. We're here to empower, educate, and entertain you on every step of your adventure. Ready to embark on a path of discovery? Start exploring now!";
const aboutContent = "Welcome to Daily Journal, where passion meets knowledge and curiosity leads the way. We are more than just a website; we are a community of explorers, thinkers, and dreamers. Our mission is to provide you with a platform where you can embark on a journey of discovery, learning, and inspiration.";
const contactContent = "We're excited to hear from you! Whether you have a question, a suggestion, or just want to say hello, don't hesitate to reach out. Feel free to drop us a line at dailyjournal@gmail.com, and you can also connect with us on Social Media Platforms for updates, discussions, and more. Your feedback and engagement mean the world to us as we continue to create content that matters to you. Let's stay connected and keep the conversation going!";


const app = express();

app.set('view engine', 'ejs'); // this line tells express that you want to use EJS as the view engine of application

app.use(bodyParser.urlencoded({extended: true})); //it sets up the middleware to parse incoming URL-encoded data from forms and makes it available in the req.body object for further processing in your application routes.
app.use(express.static("public"));


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
  }
  console.log('Connected to MySQL database');
});

app.get("/", function(req, res){

  connection.query('SELECT * FROM blog_info', (err, rows) => {
    if (err) throw err;
    res.render("home", {
      startingContent: homeStartingContent,
      posts: rows
      });
  });
});


app.post("/", function(req,res){
    res.render("compose");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  
    const title= req.body.titleBody;
    const content= req.body.postBody;
  


  const sql = 'INSERT INTO blog_info (title, content) VALUES (?, ?)';

  connection.query(sql, [title, content], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.send('Error inserting data.');
      return;
    }
    console.log('Data inserted successfully');
    res.redirect('/'); // Redirect to a success page
  });
});

app.post("/posts/:postId", function(req,res){

  

    const requestedPostId = req.params.postId;
    console.log(requestedPostId);
    const sql = 'DELETE FROM blog_info WHERE title = ?';

    connection.query(sql,requestedPostId,(err,result)=>{
      if(err){
        console.error('Error removing data:', err);
        res.send('Error removing data.');
        return;
      }
      console.log('Data removed successfully');
      res.redirect('/');
    });

}
);


app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  connection.query('SELECT * FROM blog_info WHERE title = ?', requestedPostId, (err, rows) => {
    if (err) throw err;
    res.render("post", {
      title: rows[0].title,
      content: rows[0].content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.post("/about", function(req,res){
  res.render("compose");
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.post("/contact", function(req,res){
  res.render("compose");
});


app.listen(5000, function() {
  console.log("Server started on port 5000");
});
