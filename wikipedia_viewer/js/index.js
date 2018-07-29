var apiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&namespace=0&format=json&search=";

$(document).ready(function() {
  $("#search-button").click(function(){
    getApiSearch( $("#text-input").val() );
  });
  $('input[type=text]').on('keydown', function(key) {
    if (key.which == 13) {
        getApiSearch( $("#text-input").val() );
    }
  });
  //styles
  $("#text-input").focus(function(){ hideResultsSection(); });
  $("#text-input").focusout(function(){
    if( document.getElementsByTagName('li').length > 0 ){
      showResultsSection();
    }
  });
});

function getApiSearch(topic){
  $("#results-section").css({transform: "rotateY(-90deg)"});
  $.ajax({
    url: apiUrl+topic,
    dataType: 'jsonp',
    success: function(apiResponse){
      console.log(apiResponse);
      $("#elements-list").empty();
      if(apiResponse[1].length == 0){
        var errorElement = '<li class="section result-element" style="color: red;">'+
          '<h1> ERROR, NO RESULT FOR : '+apiResponse[0]+'</h1>'+'</li>';
        $("#elements-list").append(errorElement);
      }
      else{
        for(var i=0; i<apiResponse[1].length; i++){
          var element = '<li class="section result-element">'+
          '<a target="_blank" href='+apiResponse[3][i]+'>'+
          '<h3>'+apiResponse[1][i]+'</h3>'+
          '<p>'+apiResponse[2][i]+'</p>'+'</a>'+'</li>';
          $("#elements-list").append(element);
        }
      }
      setTimeout(showResultsSection, 100);
    }
  });
}

///animation
function hideResultsSection(){
  $("#results-section").css({transform: "rotateY(-90deg)"});
  $("#search-section").animate({'margin-top': "30vh"});
  setTimeout(function(){
   $("#results-section").css({display: 'none'});
  }, 500);
}
function showResultsSection(){
  $("#results-section").css({display: 'block'});
  setTimeout(function(){
   $("#results-section").css({transform: "rotateY(0deg)"});
   $("#search-section").animate({'margin-top': "15px"});
  }, 200);
}