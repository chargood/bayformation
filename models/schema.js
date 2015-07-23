var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var User = new Schema({
	name: String
});

var Preference = new Schema({
	key: String,
	value: String
});

var Info = new Schema({
	title: String,
	content: String,
	type: String, //static, message, annoucement, emergency
	tags: [String],
	deliverTo: String
});

var Screen = new Schema({
	name: String,
	staticInfo: [String],
	pushInfo: [String],
	preferences: [Preference]
});

module.exports = {
	User: mongoose.model('User', User),
	Preference: mongoose.model('Preference', Preference),
	Info: mongoose.model('Info', Info),
	Screen: mongoose.model('Screen', Screen)
}