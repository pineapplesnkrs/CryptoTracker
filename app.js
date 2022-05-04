var express = require('express');
var app = express();
let session = require('express-session');
var PORT = 3000;
const dbMan = require("./backend/dbConn.js");
let mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
let userCol = require('./models/userSchema');
let cryptoCol = require('./models/cryptoSchema');
const {update} = require('./backend/cryptoUpdate');
var qString = require("querystring");

var tracker = express.Router();
app.use('/tracker', tracker);
app.set('views', './FrontEnd/views');
app.set('view engine', 'pug');

app.use(session({
	secret:'shhhhh',
	saveUninitialized: false,
	resave: false
}));

function moveOn(postData){
    let proceed = true;
    postParams = qString.parse(postData);
    //handle empty data
    for (property in postParams){
	if (postParams[property].toString().trim() == ''){
	    proceed = false;
	}
    }

    return proceed;
}

tracker.get('/profile/:user', async function (req, res) {
    const myDb = await dbMan.get("cryptoTracker");

    console.log("User: ", req.params['user']);
    let user = await myDb.collection("users").findOne({ username: req.params['user'] });
    console.log(user)
    res.send(user['email'])
})

app.get('/', function (req, res) {
    res.redirect('/login');
})

app.get('/login', function (req, res) {
    res.render('login');
})

app.get('/search', function (req, res) {
    if (!req.session.user){
        res.redirect('/login');
    }
    else{
    	res.render('search', {trusted: req.session.user});
	}
})

app.get('/main', async function (req, res) {
    if (!req.session.user){
        res.redirect('/login');
    }
    else{
    	const myDb = await dbMan.get("cryptoTracker");
        let cryptos = await myDb.collection("cryptos").find({}).toArray();
        res.render('main', { cryptos });
	}
})

app.get('/signup', function (req, res) {
    res.render('signup');
})

app.post('/signup', express.urlencoded({ extended: false }), async (req, res, next) => {
    console.log(req.body.user);
    if (req.body.user.split(/[;:,-\s ]+/).length > 1) {
        res.render('signup', { msg: "Usernames must be one word" })
    }
    if (req.body.password.toString() != req.body.confirm.toString()) {
        res.render('signup', { msg: "Passwords must match" });
    }

    let doc = new userCol({ _id: req.body.user, email: req.body.email, password: req.body.password });
    await doc.save()
    res.redirect('login')
});

app.post('/login', express.urlencoded({extended:false}), async (req, res, next)=>{
    let untrusted= {user: req.body.userName, password: req.body.pass};
	try{
		let result = await userCol.findOne({_id: req.body.userName});
		if (untrusted.password.toString().toUpperCase()==result.password.toString().toUpperCase()){
			let trusted = {name: result._id.toString()};
            req.session.user = trusted;
            res.redirect('main');
		} else{
			res.redirect('login');
		}
	} catch (err){
		res.redirect('login');
	}
})

var postData;
var postParams;

app.post('/search', function (req, res) {
    postData = '';
    req.on('data', (data) => {
        postData += data;
    });
    req.on('end', async () => {

        console.log(postData);

        if (moveOn(postData)) {
            var token = postParams['value'];
            try {
                let cursor = await cryptoCol.findOne({_id: token}).exec();
                if(cursor != null){
                    res.render('search', { cursor });
                } else{
                    cursor = { _id: "No results found", info: { price: "NA", priceChange24h: "NA", volChange: "NA"} };
                    res.render('search', { cursor });
                }
            } catch (e) {
                console.log(e.message);
                res.writeHead(404);
                res.write("<html><body><h1> ERROR 404. Page not found</h1>");
                res.end("<br>" + e.messge + "<br></body></html>");
            }
        } else {
            res.render('search');
        }
    });
});

app.listen(PORT, async function (err) {
    if (err) console.log(err);
    try {
        await mongoose.connect('mongodb://localhost:27017/cryptoTracker', { useNewUrlParser: true, useUnifiedTopology: true })
    } catch (e) {
        console.log(e.message);
    }
    console.log("Server listening on PORT", PORT);
});