const User = require('../models/user');
const { NotFound, ServerError, BadRequest } = require('../codeerror');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(ServerError).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NotFound).send({ message: ' Передан несуществующий id пользователя' });
      }
      res.status(200).send(user);
      return false;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Передан некорректный id пользователя ' });
      }
      res.status(ServerError).send({ message: 'Ошибка по умолчанию.' });
      return false;
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      res.status(ServerError).send({ message: 'Ошибка по умолчанию.' });
      return false;
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      res.status(ServerError).send({ message: 'Ошибка по умолчанию.' });
      return false;
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      res.status(ServerError).send({ message: 'Ошибка по умолчанию.' });
      return false;
    });
};
