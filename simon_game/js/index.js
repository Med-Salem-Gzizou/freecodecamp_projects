var simonGame = new Object();
simonGame.SNDgreen = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
simonGame.SNDred = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
simonGame.SNDyellow = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
simonGame.SNDblue = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
simonGame.errorSound = new Audio("http://www.soundjay.com/button/beep-07.mp3");
simonGame.wonSound = new Audio("http://www.soundjay.com/button/button-2.mp3");
simonGame.clickSound = new Audio("http://www.soundjay.com/button/button-6.mp3");

simonGame.init = function(){
  this.strict = false ;
  this.on = false ;
  this.clickable = false ;
  this.updateClickable();
  this.count = 0 ;
  this.series = [];
  this.playPos = 0;
  this.showStatus();
  this.clearButtons();
};
simonGame.showStatus = function(){
  $("#count").html(this.count);
  if(this.on){
    $('.start.on').hide(200);
    $('.start.off').show(200);
  }else {
    $('.start.on').show(200);
    $('.start.off').hide(200);
  }
  if(this.strict){
    $('.strict.on').show(200);
    $('.strict.off').hide(200);
  }else {
    $('.strict.on').hide(200);
    $('.strict.off').show(200);
  }
};
simonGame.showError = function(){
  simonGame.errorSound.play();
  $('#error').slideDown(200);
  setTimeout(function(){
    $('#error').slideUp(200);
  }, 1500);
};
simonGame.showWon = function(){
  simonGame.wonSound.play();
  $('#won').slideDown(200);
  setTimeout(function(){
    $('#won').slideUp(200);
  }, 3000);
};
simonGame.addCount = function(){
  var buttons = ["green", "red", "yellow", "blue"];
  this.series.push( buttons[Math.floor(Math.random()*4)] );
  this.count = this.series.length;
  this.showStatus();
}
simonGame.clearButtons = function(){
  this.green.removeClass("click");
  this.red.removeClass("click");
  this.yellow.removeClass("click");
  this.blue.removeClass("click");
}
simonGame.updateClickable = function(){
  if(this.clickable){
    this.green.addClass("clickable");
    this.red.addClass("clickable");
    this.yellow.addClass("clickable");
    this.blue.addClass("clickable");
  }else {
    this.green.removeClass("clickable");
    this.red.removeClass("clickable");
    this.yellow.removeClass("clickable");
    this.blue.removeClass("clickable");
  }
}
simonGame.playSeries = function(){
  simonGame.clearButtons();
  simonGame.clickable = false ;
  simonGame.updateClickable();
  if(!simonGame.on){ return 0; }
  
  setTimeout(function(){
    if(!simonGame.series[0]){return 0;}
    var color = simonGame.series[simonGame.playPos];
    simonGame["SND"+color].currentTime = 0;
    simonGame["SND"+color].play();
    simonGame[color].addClass("click");
    
    simonGame.playPos += 1;
    if(simonGame.playPos < simonGame.count){
      setTimeout(function(){ simonGame.playSeries(); }, 500);
    }else {
      simonGame.playPos = 0;
      setTimeout(function(){ 
        simonGame.clearButtons();
        simonGame.clickable = true ;
        simonGame.updateClickable();
      }, 500);
    }
  }, 100);
}
simonGame.start = function(){
  if(simonGame.on){
    simonGame.playPos = 0;
    simonGame.count = 0;
    simonGame.series = [];
    simonGame.showStatus();
    simonGame.addCount();
    setTimeout(simonGame.playSeries, 500);
  }else {
    simonGame.init();
  }
}

$(document).ready(function() {
  simonGame.green = $("#green");
  simonGame.red   = $("#red");
  simonGame.yellow= $("#yellow");
  simonGame.blue  = $("#blue");
  simonGame.init();
  
  $("#start").click(function(){
    simonGame.clickSound.play();
    simonGame.on = !simonGame.on;
    simonGame.start();
  });
  $("#strict").click(function(){
    simonGame.clickSound.play();
    simonGame.strict = !simonGame.strict;
    simonGame.showStatus();
  });
  
  $(".button").click(function(){
    if( simonGame.clickable ){
      var color = $(this).attr("id");
      simonGame["SND"+color].play();
      
      if( simonGame.series[simonGame.playPos] == color ){
        simonGame.playPos += 1;
      }else {
        simonGame.clickable = false;
        simonGame.updateClickable();
        simonGame.playPos = 0;
        setTimeout(simonGame.showError, 100);
        if(simonGame.strict){
          setTimeout(simonGame.start, 2000);
        }else {
          setTimeout(simonGame.playSeries, 2000);
        }
      }
      
      if( simonGame.playPos >= simonGame.count ){
        simonGame.clickable = false;
        simonGame.updateClickable();
        simonGame.playPos = 0;
        if(simonGame.count >= 20){
          setTimeout(simonGame.showWon, 100);
          setTimeout(simonGame.start, 3000);
        }else {
          simonGame.addCount();
          setTimeout(simonGame.playSeries, 1000);
        }
      }
    }
  });
  
});