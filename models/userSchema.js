//Christian Smith
let mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: [true, 'We need to know your name']
    },
	password:{
        type: String,
        required: [true, 'must have password']
    },
	email:{
		type: String,
		required: [true, 'You must enter an email']
	},
    favorites: Array,

});
const userCol = mongoose.model('User', userSchema)

module.exports = userCol;