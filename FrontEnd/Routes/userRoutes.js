var express = require("express");
var router = express.Router();
let cryptoCol = require('../models/cryptoSchema');
let userCol = require('../models/userSchema');

router.get('/:userID', async (req, res)=> {

    try{
        let user = await userCol.findOne({_id: req.parms.userID});
        let cryptoArr = await cryptoCol.find({user: req.params.userID});

        res.render('user', {searchID: user._id, crypto: cryptoArr});
    
    }catch (err){
        res.status(500).render('error', {message: err.message})
    }
});

module.exports = router;