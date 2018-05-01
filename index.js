const express = require('express')
const path = require('path')
const mongodb = require('mongodb')
const PORT = process.env.PORT || 5000

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'))

app.get('/mongodb', function (request, response) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    if(err) throw err;
    const Routes = db.collection('Routes');
    Routes.find({ frequency : { $gte: 0 } }).sort({ name: 1 }).toArray(function (err, docs) {
      alert(JSON.stringify(docs));
      if(err) throw err;
      response.render('pages/mongodb', {results: docs});
    });

    //close connection when your app is terminating.
    db.close(function (err) {
      if(err) throw err;
    });
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
