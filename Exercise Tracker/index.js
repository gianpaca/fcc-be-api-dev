const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const usersPath = '/api/users';
const idPath = usersPath+'/:_id';
const exercisesPath = idPath+'/exercises';
const logsPath = idPath+'/logs';
let users = [];
let seq = 0;

const generateId = () => {
  seq++;
  return '_' + seq;
};

app.post(usersPath, (req, res) => {
  const { username } = req.body;
  const newUser = {
    username,
    _id: generateId()
  };
  users.push(newUser);
  res.json(newUser);
});

app.get(usersPath, (req, res) => {
  res.json(users);
});

app.post(exercisesPath, (req, res) => {
  const { description, duration, date } = req.body;
  const userId = req.params._id;
  const user = users.find(user => user._id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const exercise = {
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString()
  };
  user.log = user.log || [];
  user.log.push(exercise);
  res.json({ username: user.username, _id: userId, ...exercise });
});

app.get(logsPath, (req, res) => {
  const userId = req.params._id;
  const user = users.find(user => user._id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  let { from, to, limit } = req.query;
  // if no limit is passed, retrieve all exercises possible
  limit = limit ? parseInt(limit) : user.log.length;
  let log = user.log || [];
  if (from) {
    log = log.filter(exercise => new Date(exercise.date) >= new Date(from));
  }
  if (to) {
    log = log.filter(exercise => new Date(exercise.date) <= new Date(to));
  }
  log = log.slice(0, limit);
  res.json({
    username: user.username,
    _id: userId,
    count: log.length,
    log
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
