var mongo = require('mongodb');
var mongoose = require('mongoose');

var validUrl = require('valid-url');
const urlModule = require('url');
const dns = require('dns');

var Counter = require('../models/counter.js');
var UrlModel = require('../models/urlModel.js');

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {useNewUrlParser: true});


function getCounter(callBack){
  Counter.findOne({type: 'urlsCounter'}, function(err, data){
    if(data === null){
      Counter.create({type: 'urlsCounter', number: 0}, (err, data) => {
        callBack(0);
      });
    }else{
      callBack(data.number);
    }
  });
};

function saveUrl(urlStr, done){
  UrlModel.findOne({url: urlStr}, function(err, data){
    
    if(data === null){ // url not exist in db => create one
      // get counter number
      getCounter(function(counterNumber){
        let number = counterNumber + 1;  
        // update counter
        Counter.findOneAndUpdate({type: 'urlsCounter'}, {number: number}, function(){
          // add new url to db
          new UrlModel({ url: urlStr, number: number }).save(done);
        });
      });
    }else{ // url exist => return it
      done(err, data);
    }
  
  });
};

exports.addUrl = function(req, res){
  console.log(req.body.url);
  // check if valide url
  if (validUrl.isUri(req.body.url)){
    console.log('Looks like an URI'); 
    // check if valide hostname
    let url = urlModule.parse(req.body.url);
    dns.lookup(url.hostname, function(err, address, family) {
      console.log('address: %j family: IPv%s', address, family);
      if(err === null){
        saveUrl(url.href, function(err, data){
          res.json({"original_url": data.url, "short_url": data.number});
        });
      }else{
        // invalid hostname
        res.json({ "error": "invalid Hostname" });
      }
    });
  } else {
    console.log('Not a URI');
    res.json({ "error": "invalid URL" });
  }
};

exports.getUrl = function(req, res){
  console.log('get url number:', req.params.number);
  if( isNaN(req.params.number) ){
    res.json({"error": "invalid input"});
  }else{
    let urlNumber = parseInt(req.params.number);
    UrlModel.findOne({number: urlNumber}, function(err, data) {
      if(data === null){
        res.json({"error": "URL not fund"});
      }else{
        res.redirect(data.url);
      }
    });
  }
};