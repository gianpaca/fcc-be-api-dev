var express = require('express');
var cors = require('cors');
require('dotenv').config();
const multer = require('multer');

var app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const fileUploadPath = '/api/fileanalyse';

app.post(fileUploadPath, upload.single('upfile'), (req, res) => {
  if(!req.file) {
    res.status(400).json({ error: 'No file selected for upload' });
  }
  const { originalname, mimetype, size } = req.file;
  res.json({
    name: originalname,
    type: mimetype,
    size
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
