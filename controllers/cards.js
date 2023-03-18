/* eslint-disable consistent-return */
const Card = require('../models/card');
const { NotFound, ServerError, BadRequest } = require('../codeerror');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(ServerError).send({ message: 'Ошибка по умолчанию. ' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BadRequest)
          .send({ message: 'Переданы некорректные данные при создании карточки. ' });
      }
      return res.status(ServerError).send({ message: 'Ошибка по-умолчанию. ' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: ' Передан несуществующий id карточки' });
      }
      res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(BadRequest).send({ message: 'Передан некорректный id карточки. ' });
      }
      res.status(ServerError).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: ' Передан несуществующий id карточки' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BadRequest)
          .send({ message: 'Передан некорректный id карточки. ' });
      }
      return res.status(ServerError).send({ message: 'Ошибка по-умолчанию. ' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: ' Передан несуществующий id карточки' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BadRequest)
          .send({ message: 'Переданы некорректный id карточки. ' });
      }
      return res.status(ServerError).send({ message: 'Ошибка по-умолчанию. ' });
    });
};
