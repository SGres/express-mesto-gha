const Card = require('../models/card');
// NotFound

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию. ' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании карточки. ' });
      }
      return res.status(500).send({ message: 'Ошибка по-умолчанию. ' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена. ' });
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные для постановки лайка. ' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки. '});
      }
      return res.status(500).send({ message: 'Ошибка по-умолчанию. ' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные для постановки лайка. ' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки. '});
      }
      return res.status(500).send({ message: 'Ошибка по-умолчанию. ' });
    });
};
