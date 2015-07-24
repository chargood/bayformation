var Router = Backbone.Router.extend({
	
	routes:{
		'':'home',
		'screen/create':'createScreen',
		'screen/edit/:id':'editScreen',
		'pushInfo/announcement':'announcement',
		'pushInfo/message/:id':'message',
		'staticInfo':'info'
	}
});

var router = new Router;

var screenListView = new ScreenListView();
var screenEditView = new ScreenEditView();
var messageView = new MessageView();
var announcementView = new AnnouncementView();

router.on('route:home', function() {
  console.log("list screens")
  screenListView.render();
  
})
router.on('route:createScreen', function() {
  console.log("create screen")
  screenEditView.render();  
})
router.on('route:message', function(id) {
  console.log("send message")
  messageView.render({id: id});
})
router.on('route:announcement', function() {
  console.log("send announcement")
  announcementView.render();
})

Backbone.history.start();