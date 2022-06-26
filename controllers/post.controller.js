const { Pool } = require('pg');
const connection = new Pool();
const verify = require('../verifyToken');



exports.submitPost = async (req, res) => {
  // constructor
  const Post = function (post) {
    this.message = post.message;
    this.userId = post.userId;
    this.image = post.image;
    this.first_name = post.first_name;
    this.last_name = post.last_name
  }

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    // Creat New Post
    const newPost = new Post({
      message: req.body.message,
      userId: req.body.userId,
      image: url + '/images/' + req.file.filename,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    })
    return connection.query("INSERT INTO post SET ?", newPost, (error, results) => {
      if (error) {
        console.log("error:", "sumbit with file have error");
      }
      if (results) {
        res.status(200).json({
          message: "post submit successfully with image ",
        })
      }
    });
  }
  if (req.body.message) {
    // Creat New Post
    const newPost = new Post({
      message: req.body.message,
      userId: req.body.userId,
      first_name: req.body.first_name,
      last_name: req.body.last_name

    })
    return connection.query("INSERT INTO post SET ?", newPost, (error, results) => {
      if (error) {
        console.log("error:", error);
      }
      if (results) {
        res.status(200).json({
          message: "post submit successfully without image ",
        })
      }
    });
  }
}
exports.getAllPost = async (req, res) => {

  connection.query("SELECT * FROM post ORDER BY id DESC;", (err, results) => {
    if (err) {
      res.send('something wrong!')
    }
    if (results) {
      res.send(results)
    }
  })
}

exports.deletePost = async (req, res) => {
  const id = req.body.id
  if (!id) {
    return res.status(400).send({
      message: "error in request!",
    })
  }

  connection.query(" DELETE FROM post WHERE id = ? ", id, (error, results) => {

    if (error) {
      return res.send({
        message: "somthing wrong! ",
        error: error
      })
    }
    if (results) {
      res.status(200).send({
        message: "your post deleted!"
      })
    }
  })
}

exports.getSpecificPost = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.send("somthing wrong in your request body")
  }
  connection.query("SELECT * FROM post WHERE userId = ? ORDER BY id DESC", id, (error, results) => {
    if (error) {
      return res.send(error)
    }
    if (results) {
      res.status(200).send(results)
    }
  })
}