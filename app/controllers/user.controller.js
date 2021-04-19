const db = require('../models')
const User = db.user

exports.allAccess = (req, res) => {
  User.find({}, (err, users) => {
    const userMap = []

    users.forEach(function (user) {
      const { _id, email, username, createdAt, lastLogin, isMuted } = user
      const item = {
        _id,
        email,
        username,
        createdAt,
        lastLogin,
        isMuted
      }
      userMap.push(item)
    })

    res.send(userMap)
  })
}

exports.deleteUser = (req, res) => {
  const { id } = req.params

  User.deleteMany({ _id: id }, function (err, user) {
    if (!err) {
      res.status(200).send({ id })
    }
  })
}

exports.muteUser = (req, res) => {
  const { id } = req.params

  User.findOne({ _id: id }, function (err, user) {
    if (!err) {
      user.isMuted = true

      user.save((error) => {
        if (error) {
          return res.status(500).send({ message: error })
        }

        res.status(200).send({
          id: user._id
        })
      })
    }
  })
}

exports.userBoard = (req, res) => {
  res.status(200).send('User Content.')
}
