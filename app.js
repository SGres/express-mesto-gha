const express = require('express');
const mongoose = require('mongoose');
const { NotFound } = require('./codeerror');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '640ccfb8240140435e809cd0',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', (req, res) => {
  res.status(NotFound).json({ message: ' Запрашиваемый ресурс не найден ' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
