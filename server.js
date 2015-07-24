// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('./public_html'));

var port = process.env.PORT || 5000;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bayformation'); // connect to our database

var Schema = require('./models/schema');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Request Made '+req);
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'This is the bayformation api' });   
});

router.route('/screen')
	
	.post(function(req, res) {
		
		var screen = new Schema.Screen(req.body)
        
        screen.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Screen created!' });
        });
		
	})
	
	.get(function(req, res) {
        Schema.Screen.find(function(err, screens) {
            if (err)
                res.send(err);

            res.json(screens);
        });
    });
	
	
	router.route('/screen/:screen_id')
	
	.get(function(req, res) {
        Schema.Screen.findById(req.params.screen_id, function(err, screen) {
            if (err)
                res.send(err);
            res.json(screen);
			/*var resScreen=screen;
			//resScreen.pushInfo=[]
			
			for(var i = 0; i<screen.pushInfo.length;i++){
				Schema.Info.findById(screen.pushInfo[i], function(err, info) {
					if (err)
						res.send(err);
					resScreen.pushInfo.push(info)
					console.log("info: "+resScreen.pushInfo)
				});
			}
			res.json(resScreen);*/
        });
    })
	
	.delete(function(req, res) {
        Schema.Screen.remove({
            _id: req.params.screen_id
        }, function(err, screen) {
            if (err)
                res.send(err);

            res.json({ message: 'Screen Successfully deleted' });
        });
    });
	
	
	router.route('/pushInfo/:screen_id')
	
	.get(function(req, res) {
        Schema.Screen.findById(req.params.screen_id, function(err, screen) {
            if (err)
                res.send(err);
            res.json(screen.pushInfo);
        });
    })
	
	.post(function(req, res) {
		var info = new Schema.Info(req.body)
		info.save(function(err) {
            if (err)
                res.send(err);

			//Schema.Screen.findById(req.params.screen_id, {$push: {"pushInfo": info.id}});
			Schema.Screen.findById(req.params.screen_id, function(err, screen) {
				if (err)
					res.send(err);
				screen.pushInfo.push(info.id);
				screen.save(function(err) {
					if (err)
						res.send(err);
				});
            
			});
			res.json({ message: 'Info created!' });
        });
		
	})
	
	.delete(function(req, res) {
        
		Schema.Screen.findById(req.params.screen_id, function(err, screen) {
			if (err)
				res.send(err);
			screen.pushInfo=[];
			screen.save(function(err) {
				if (err)
					res.send(err);
			});
		
		});
    });
	
	router.route('/screen/:screen_id/:pushInfo_id')
	
	.delete(function(req, res) {
        
		Schema.Screen.findById(req.params.screen_id, function(err, screen) {
			if (err)
				res.send(err);
			screen.pushInfo.pull(req.params.screen_id);
			screen.save(function(err) {
				if (err)
					res.send(err);
			});
		
		});
    });
	
	router.route('/pushInfo')
	
	.post(function(req, res) {
		
		var info = new Schema.Info(req.body)
		info.save(function(err) {
            if (err)
				res.send(err);
			
			if(info.type=="announcement"){
			
				Schema.Screen.find(function(err, screens) {
					if (err)
						res.send(err);

					
					screens.forEach(function (err,screen){
						if (err) 
							res.send(err);
						screens[screen].pushInfo.push(info.id);
						screens[screen].save(function(err) {
							if (err)
								res.send(err);
						});
						
					});
				});				
				
			}
			else if(info.type=="message"){
				Schema.Screen.findById(info.deliverTo, function(err, screen) {
					if (err)
						res.send(err);
					screen.pushInfo.push(info.id);
					screen.save(function(err) {
						if (err)
							res.send(err);
						
						res.send("Message Sent");
					});
				
				});
			}
        });
	});
	
	router.route('/staticInfo')
	.post(function(req, res) {
		
		var info = new Schema.Info(req.body)
		info.save(function(err) {
            if (err)
				res.send(err);
			
			Schema.Screen.find(function(err, screens) {
				if (err)
					res.send(err);

				
				screens.forEach(function (err,screen){
					if (err) 
						res.send(err);
					screens[screen].staticInfo.push(info.id);
					screens[screen].save(function(err) {
						if (err)
							res.send(err);
					});
					
				});
			});
        });
	});
	
	router.route('/info')
	.get(function(req, res) {
        Schema.Info.find(function(err, infos) {
            if (err)
                res.send(err);

            res.json(infos);
        });
    })
	
	
	
	
	router.route('/info/:info_id')
	
	.get(function(req, res) {
        Schema.Info.findById(req.params.info_id, function(err, info) {
            if (err)
                res.send(err);
            res.json(info);			
        });
    })
	
	.delete(function(req, res) {
        Schema.Info.remove({
            _id: req.params.info_id
        }, function(err, info) {
            if (err)
                res.send(err);           
			
			Schema.Screen.find(function(err, screens) {
				if (err)
					res.send(err);

				
				screens.forEach(function (err,screen){
					if (err) 
						res.send(err);
					screens[screen].staticInfo.pull(req.params.info_id);
					screens[screen].pushInfo.pull(req.params.info_id);
					screens[screen].save(function(err) {
						if (err)
							res.send(err);
					});
					
				});
			});
			
			res.json({ message: 'Info Successfully deleted' });
        });
    });

	

// REGISTER OUR ROUTES -------------------------------
app.use('/bayformation', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Serving on port ' + port);
