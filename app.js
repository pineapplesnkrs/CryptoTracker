var express = require('express');
var app = express();
let session = require('express-session');
var PORT = 3000;
const dbMan = require("./backend/dbConn.js");
let mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
let userCol = require('./models/userSchema');
const {update} = require('./backend/cryptoUpdate');

var tracker = express.Router();
app.use('/tracker', tracker);
app.set('views', './FrontEnd/views');
app.set('view engine', 'pug');

app.use(session({
	secret:'shhhhh',
	saveUninitialized: false,
	resave: false
}));

tracker.get('/profile/:user', async function (req, res) {
    const myDb = await dbMan.get("cryptoTracker");

    console.log("User: ", req.params['user']);
    let user = await myDb.collection("users").findOne({ username: req.params['user'] });
    console.log(user)
    res.send(user['email'])
})

app.get('/', function (req, res) {
    res.render('login');
})

app.get('/login', function (req, res) {
    res.render('login');
})

app.get('/search', function (req, res) {
    res.render('search');
})

app.get('/signup', function (req, res) {
    res.render('signup');
})

app.get('/crypto', function (req, res) {
    update();
    res.render('crypto');
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
            res.redirect('crypto');
		} else{
			res.redirect('login');
		}
	} catch (err){
		next(err)
	}
})

app.listen(PORT, async function (err) {
    if (err) console.log(err);
    try {
        await mongoose.connect('mongodb://localhost:27017/cryptoTracker', { useNewUrlParser: true, useUnifiedTopology: true })
    } catch (e) {
        console.log(e.message);
    }
    console.log("Server listening on PORT", PORT);
});