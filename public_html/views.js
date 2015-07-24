var ScreenListView = Backbone.View.extend({
	el: $('#page'),
	initialize: function(){
		this.render();
    },
	render: function(){
		var that = this;
		var screenlist = new ScreenList();
		screenlist.fetch({
			success: function(screenlist){
				var template = _.template($('#screenlisttemplate').html())
				that.$el.html(template({
					screenlist:screenlist.models
				}))
			}
		})
	}
});

var ScreenEditView = Backbone.View.extend({
  el: $('#page'),
  events: {
	'submit .edit-screen-form': 'saveScreen'
  },
  saveScreen: function (ev) {
	var screenDetails = $(ev.currentTarget).serializeObject();
	screenDetails.preferences=[];
	screenDetails.pushInfo=[];
	screenDetails.staticInfo=[];
	var screen = new Screen();
	screen.save(screenDetails, {
	  success: function (screen) {
		router.navigate('', {trigger:true});
	  }
	});
	return false;
  },
  
  render: function (options) {
	var that = this;
	if(options&&options.id) {
	  that.screen = new Screen({id: options.id});
	  that.screen.fetch({
		success: function (screen) {    
		  var template = _.template($('#edit-screen-template').html());
		  that.$el.html(template);
		  that.$el.html(template({
			editscreen:screen
		  }))
		}
	  })
	} else {
	  var template = _.template($('#edit-screen-template').html());
	  that.$el.html(template({
		editscreen:null
	  }))
	}
  }
});

var MessageView = Backbone.View.extend({
  el: $('#page'),
  events: {
	'submit .message-form': 'saveMessage'
  },
  saveMessage: function (ev) {
	var msgDetails = $(ev.currentTarget).serializeObject();
	msgDetails.title="Message"
	msgDetails.type="message"
	var message = new PushInfo();
	console.log("message sending")
	message.save(msgDetails, {
	  success: function (message) {
		console.log("message sent")
		
	  }
	});
	router.navigate('', {trigger:true});
	return false;
  },
  render: function (options) {
	var that = this;
	
	that.msgscreen = new Screen({id: options.id});
	that.msgscreen.fetch({
		success: function (msgscreen) {    
		  var template = _.template($('#message-template').html());
		  that.$el.html(template({
			msgscreen:msgscreen
		  }))
		}
	})
  }
});
  