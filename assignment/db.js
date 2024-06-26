const express = require('express'),
  path = require('path'),
  mongo = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser');

const app = express();

mongo.Promise = global.Promise;
mongo.connect('mongodb://localhost:27017/storage', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log('Sikerült csatlakozni az adatbázishoz.')
  },
  error => {
    console.log('Hiba történt: ' + error)
  }
)

const Schema = mongo.Schema;

const itemRoute = express.Router();
let Item = new Schema({
  itemName: {
    type: String
  },
  itemCode: {
    type: String
  },
  itemType: {
    type: String
  },
  price: {
    type: Number
  }
}, {
  collection: 'item'
});

var itemModel = mongo.model('items', Item, 'items');

itemRoute.route('/addItem').post((req, res, next) => {
  itemModel.create(req.body, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      res.json(data)
    }
  })
});

itemRoute.route('/getItem').get((req, res) => {
  itemModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

itemRoute.route('/getItem/:id').get((req, res) => {
  itemModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})



const userRoute = express.Router();
let User = new Schema({
  uname: {
    type: String
  },
  password: {
    type: String
  }
}, {
  collection: 'users'
})

var userModel = mongo.model('users', User, 'users');

userRoute.route('/addUser').post((req, res, next) => {
  userModel.create(req.body, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      res.json(data)
    }
  })
});

userRoute.route('/getallUser').get((req, res) => {
  userModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

userRoute.route('/getUser/:id').get((req, res) => {
  userModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/assignment')));
app.use('/', express.static(path.join(__dirname, 'dist/assignment')));

app.use('', userRoute)
app.use('', itemRoute)

app.listen(8080);
console.log('8080 porton elindult az adatbázisszerver.');
