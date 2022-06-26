const { Pool } = require('pg');
const connection = new Pool();


exports.submitComment = async (req, res) => {
  const comment = req.body.comment;
  const userId = req.body.userId;
  const postId = req.body.postId;

  connection.query("INSERT INTO comments SET comment=? , userId=? , postId=?", [comment, userId, postId], (error, results) => {
    if (error) {
      res.status(400).send({
        message: "problem in comment system"
      })
    }
    if (results) {
      res.status(200).send({
        message: "thank you for your submission comment"
      })
    }
  })
}

exports.getComment = async (req, res) => {

  connection.query("SELECT * FROM comments", (error, results) => {
    if (error) {
      res.status(400).send(error)
    }
    if (results) {
      res.status(200).send(results)
    }
  })

}

exports.deleteComment = async (req, res) => {
  const id = req.body.idComment;
  connection.query(`DELETE FROM comments WHERE id = ?`, [id], (error, results) => {
    if (error) {
      return res.json({
        message: "you have error in deleteComment",
        error: error
      })
    }
    if (results) {
      return res.json({
        message: "comment deleted!",
        results: results
      })
    }
  })
}

exports.editComment = async (req, res) => {
  const id = req.body.id;
  const comment = req.body.comment;
  connection.query("UPDATE comments SET comment = ? WHERE id = ?", [comment, id], (error, results) => {
    if (error) {
      res.send(error)
    }
    if (!comment) {
      return connection.query("DELETE FROM `comments` WHERE id=?", id, (error, results) => {
        if (error) {
          res.send(error)
        }
        if (results) {
          res.send("your comment deleted!")
        }
      })
    }
    if (results) {
      res.send("comment updated successfully")
    }
  })
}