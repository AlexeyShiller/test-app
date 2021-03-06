const config = require('../config/auth.config')
const db = require('../models')
const User = db.user

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    lastLogin: null,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    isMuted: false
  })

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }

    res.send({ message: 'User was registered successfully!' })
  })
}

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }

    if (!user) {
      return res.status(404).send({ message: 'User Not found.' })
    }

    if (user.isMuted) {
      return res.status(404).send({ message: 'User is muted' })
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    )

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!'
      })
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    })

    user.lastLogin = new Date()

    user.save((error) => {
      if (error) {
        return res.status(500).send({ message: error })
      }

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      })
    })
  })
}
