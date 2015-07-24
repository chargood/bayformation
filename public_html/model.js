var ScreenList = Backbone.Collection.extend({
	url: '/bayformation/screen'
})

var Screen = Backbone.Model.extend({
	urlRoot: '/bayformation/screen'
})

var Info = Backbone.Model.extend({
	urlRoot: '/bayformation/info'
})

var PushInfo = Backbone.Model.extend({
	urlRoot: '/bayformation/pushInfo'
})