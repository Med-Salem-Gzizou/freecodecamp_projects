const BACKGROUND_COLORS = ["#4eaf30",
	"#a94442",
	"#337ab7",
	"#31708f",
	"#47cf73",
	"#3c763d",
	"#8a6d3b",
	"#DDA0DD",
	"#F08080",
	"#00CED1",
	"#ADD8E6",
	"#DEB887",
	"#9932CC",
	"#BC8F8F",
	"#DA70D6"
];

function changeColor(){
  randomIndex = Math.floor(Math.random()*BACKGROUND_COLORS.length+1);
  randomColor = BACKGROUND_COLORS[randomIndex];
  $("body").css("background-color", randomColor);
  $("body").css("color", randomColor);
};

function removeQuote(){
  $(".quote-holder").css( "box-shadow", '0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)' );
  
  $(".quote-holder")
  .css({ transformOrigin: '10px 10px' })
  .transition({ rotate: '-120deg' })
  .transition({ y: -800,delay: 0 })
  .transition({ rotate: '0deg' , duration: 50});
};

function restoreQuote(){
  $(".quote-holder").transition({ y: 0, duration: 500 }, function() {
    $(".quote-holder").css( "box-shadow", 'none' );
  });
};

const API_URL = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";

function newQuote(){
  $.ajax({
    headers: {
      Accept: "application/json"
    },
    url: API_URL,
    success: function(resp) {
      console.log(resp);
      let content = resp[0].content;
      let author = resp[0].title;
      updateQuote(content, author);
    },
    cache: false
  });
  
};

function updateQuote(content, author){
  $("#text").html(content);
  $("#author").html("--"+author);  
  let tweetHref = "https://twitter.com/intent/tweet?text="+content+" -"+author;
  $("#tweet-quote").attr("href", tweetHref);
}

$(document).ready(function() {
  changeColor();
  newQuote();
  $("#new-quote").on("click", function() {
    changeColor();
    removeQuote();
    newQuote();
    restoreQuote();
  });
  
});