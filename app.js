const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');


// bring in modules
let Article = require('./models/article');

const dbConnectionOptions = {
    useMongoClient: true,
    authSource: "admin"
}
mongoose.connect("mongodb://admin:utkow1991@localhost:27017/nodekb", dbConnectionOptions);
let db = mongoose.connection

// chceck connection
db.once('open', () => {
    console.log('Connected to mongoDB');
});

// chceck for db errors
db.on('error', (err) => {
    console.log(err);
});

// init app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

// load viev engine
app.set('vievs', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});



// add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add article'
    });
});

// specific article route
app.get('/articles/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        });
    })
});

// add submite post route
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    })
});

// specific article route
app.get('/articles/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    })
});

// update submite post route
app.post('/articles/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    }

    Article.updateOne(query, article, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    })
});

app.delete('/article/:id', (req, res) => {
    let query = {
        _id: req.params.id
    }
    Article.deleteOne(query, (err) => {
        if (err) {
            console.log(err);
        }
        res.send('Succesly removed');
    })
})

// start server
app.listen(3000, () => {
    console.log('Server started on port 3000.....');
})