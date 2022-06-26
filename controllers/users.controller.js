const { Pool } = require('pg');
const connection = new Pool();
const { signupValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.signup = async (req, res) => {

  // Validate the data 
  const { error } = signupValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // constructor
  const Users = function (user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.password = user.password;
  };

  // Creat New User
  const user = new Users({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hashedPassword,
  });

  // Save user in the database
  // Check if email exist in db
  const email = req.body.email;
  connection.query("SELECT * FROM users WHERE email=?", email, async (error, results) => {
    if (error) {
      return res.send(error)
    }
    if (results) {
      if (results.length) {
        return res.send({
          message: "email exist:",
          email: false
        })
      }
      else {
        connection.query("INSERT INTO users SET ?", user, (error, result) => {
          if (error) {
            res.send({
              message: error
            })
          }
          if (result) {
            res.status(200).json({
              message: "Account successfully created "
            })
          }
        });
      }
    }
  });
}

exports.login = async (req, res) => {
  // Validate the data 
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const email = req.body.email;
  const password = req.body.password;

  // Checking if the email exists and match password
  connection.query('SELECT * FROM users WHERE email=?', [email], async (error, results) => {
    if (error) {
      res.send({ "failed": "ocurred" })
    }
    if (results.length) {
      // Checking Password
      const comparision = await bcrypt.compare(password, results[0].password)
      // Create a token  
      const token = jwt.sign({ id: results[0].id }, process.env.TOKEN_SECRET);
      res.header('Authorization', token);

      if (comparision) {
        res.send({
          "first_name": results[0].first_name,
          "last_name": results[0].last_name,
          "email": results[0].email,
          "id": results[0].id,
          "success": "login sucessfull",
          "token": token
        })
      }
      else {
        res.status(400).json("password does not match")
      }
    }
    else {
      res.status(400).send("Email doesn't exist")
    }
  })
};

exports.getAlltUsers = async (req, res) => {
  // const id = req.body.userId;
  connection.query("SELECT * FROM users ", (err, results) => {
    if (err) {
      console.log(err);
      res.status(400).json("you can't get the users")
    }
    if (results) {
      res.status(200).json(results)
    }
  })
}

exports.submitUserImage = async (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  const image = url + '/images/' + req.file.filename;
  const id = req.body.id;

  connection.query("UPDATE users SET imageUser = ? WHERE id = ?", [image, id], (error, results) => {
    if (error) {
      res.send({
        message: "you can't update the images",
        error: error
      })
    }
    if (results) {
      res.send("your image update successfully !")
    }
  })
}

exports.deleteImageProfile = async (req, res) => {
  const id = req.body.id;
  connection.query("UPDATE users SET imageUser = NULL WHERE id = ?", id, (error, results) => {
    if (error) {
      res.send(error)
    }
    if (results) {
      res.send("image profile deleted !")
    }
  })
}

exports.getOneUser = async (req, res) => {
  const id = req.body.id
  connection.query("SELECT * FROM users WHERE id =?", id, (error, results) => {
    if (error) {
      res.send(error)
    }
    if (results) {
      res.send(results)
    }
  })
}

exports.editInfo = async (req, res) => {

  const dateBrith = req.body.dateBrith;
  const gender = req.body.gender;
  const city = req.body.city;
  const country = req.body.country;
  const id = req.body.id;

  connection.query("UPDATE users SET  dateBrith = ? , city = ? , country = ? , gender = ? WHERE id = ? ", [dateBrith, city, country, gender, id], (error, results) => {

    if (error) {
      res.send(error)
    }
    if (results) {
      res.send({ message: "data updated successfully!" })
    }
  })

}

exports.deleteAccount = async (req, res) => {
  const id = req.body.id;
  connection.query("DELETE FROM `users` WHERE id=?", id, (error, results) => {
    if (error) {
      res.send(error)
    }
    if (results) {
      res.send({
        message: "account deleted successfully!"
      })
    }
  })
}

exports.submitCoverImg = async (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  const image = url + '/images/' + req.file.filename;
  const id = req.body.id;

  connection.query("UPDATE users SET imgCover = ? WHERE id = ?", [image, id], (error, results) => {
    if (error) {
      res.send({
        message: "you can't update the cover image",
        error: error
      })
    }
    if (results) {
      res.send("your cover image update successfully !")
    }
  })
}

exports.deleteCoverImg = async (req, res) => {
  const id = req.body.id;
  connection.query("UPDATE users SET imgCover = NULL WHERE id = ?", id, (error, results) => {
    if (error) {
      res.send(error)
    }
    if (results) {
      res.send("cover image deleted !")
    }
  })
}

exports.searchUsers = async (req, res) => {
  const words = req.body.words;
  const searchWords = words + '%'
  connection.query("SELECT * FROM `users` WHERE first_name LIKE ?", searchWords, (error, results) => {
    if (error) {
      res.send(error)
    }
    if (results) {
      res.send(results)
    }
  })
}