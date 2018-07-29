var player1 = "";
var player1Wins = 0;
var player2 = "";
var player2Wins = 0;
var board = [["", "", ""],
             ["", "", ""],
             ["", "", ""]];
var gameOn = false;

$(document).ready(function() {
  $(".square").click(function() {
    if(!player1 && !player2){     // select X or O
      if( $(this).attr('id') == '10' ){
        player1 = "x";
        player2 = "o";
        clearBoard();
      }
      if( $(this).attr('id') == '12' ){
        player1 = "o";
        player2 = "x";
        clearBoard();
      }
    }else if(gameOn) {                    // start the game
      if( !board[$(this).attr('id')[0]][$(this).attr('id')[1]] ){
        board[$(this).attr('id')[0]][$(this).attr('id')[1]] = player1;
        setSquare($(this).attr('id'), player1);
        AImove();
      }
    }
  });
  /////////////style
  $(".square").hover(function(){
    if( $(this).children().html() == 'X' ){
      $(this).css("background-color", "#ffbcbc");
    }else if( $(this).children().html() == 'O' ){
      $(this).css("background-color", "#c5dafb");
    }else if(player1 == 'x'){
      $(this).css("background-color", "#ffbcbc");
    }else if(player1 == 'o'){
      $(this).css("background-color", "#c5dafb");
    }
  }, function(){
    $(this).css("background-color", "#fff");
  });
});

/////////////////////////////////////////
function setSquare(squareId, val){
  if(val == 'x'){
    $('#'+squareId).html('<div class="x hide">X</div>');
  }else {
    $('#'+squareId).html('<div class="o hide">O</div>');
  }
  setTimeout(function(){
  $('#'+squareId).children().removeClass("hide");
  }, 100);
}
function winAnimation( lineId ){
  if( lineId.z == 1 ){
    for(var x=0; x<3; x++){ for(var y=0; y<3; y++){
      if( x != y ){ $('#'+x+y).addClass("rotate"); }
    }}
  }else if( lineId.z == 2 ){
    for(var x=0; x<3; x++){ for(var y=0; y<3; y++){
      if( x+y != 2 ){ $('#'+x+y).addClass("rotate"); }
    }}
  }else {
    for(var x=0; x<3; x++){ for(var y=0; y<3; y++){
      if( x != lineId.x && y != lineId.y ){
        $('#'+x+y).addClass("rotate");
      }
    }}
  }
}

function clearBoard(){
  board = [["", "", ""],
           ["", "", ""],
           ["", "", ""]];
  $(".square").removeClass('rotate');
  $(".square").children().html('.');
  $(".square").children().addClass('hide');
  $("#player1").html(player1Wins);
  $("#player2").html(player2Wins);
  $("#player1").removeClass('hide');
  $("#player2").removeClass('hide');
  gameOn = true;
  playCorner = true;
}

/////////////////////////////////////////
function AImove(){
  if( scanWiner() == player1 ){
    player1Wins += 1;
    gameOn = false;
    setTimeout(clearBoard, 1000);
  }else if( scanWiner() ){
    if( getWinChance()[0] ){
      var move = getWinChance()[0].slice(1);
    }else {
      if( board[1][1] ){
        var move = getCenterStrategy();
      }else{
        var move = getCornerStrategy();
      }
    }
    board[move[0]][move[1]] = player2;
    setSquare(move[0].toString()+move[1].toString(), player2);
  }else{
    gameOn = false;
    setTimeout(clearBoard, 1000);
  }
  if( scanWiner() == player2 ){
    player2Wins += 1;
    gameOn = false;
    setTimeout(clearBoard, 2000);
  }
}

function scanWiner(){
  for(var i=0; i<3; i++){
    if( board[i][0] == board[i][1] && board[i][0] == board[i][2] ){ //row
      if( board[i][0] ){
        winAnimation({ x: i });
        return board[i][0]; }
    }
    if( board[0][i] == board[1][i] && board[0][i] == board[2][i] ){ //colum
      if( board[0][i] ){
        winAnimation({ y: i });
        return board[0][i]; }
    }
  }
  if( board[0][0] == board[1][1] && board[0][0] == board[2][2] ){
    if( board[0][0] ){
      winAnimation({ z: 1 });
      return board[0][0]; }
  }
  if( board[0][2] == board[1][1] && board[0][2] == board[2][0] ){
    if( board[0][2] ){
      winAnimation({ z: 2 });
      return board[0][2]; }
  }
  for(var x=0; x<3; x++){
    for(var y=0; y<3; y++){
      if( !board[x][y] ){ return true; }
    }
  }
  return false;
}

function getWinChance(){
  var result = []
  var target = [player2+player2, player1+player1];
  for(var t=0; t<2; t++){
    for(var i=0; i<3; i++){
      if( board[i][0] + board[i][1] + board[i][2] == target[t] ){
        for(var y=0; y<3; y++){ if(!board[i][y]){
          result.push([target[t][0], i, y]);} }
      }
      if( board[0][i] + board[1][i] + board[2][i] == target[t] ){
        for(var y=0; y<3; y++){ if(!board[y][i]){
          result.push([target[t][0], y, i]);} }
      }
    }
    if( board[0][0] + board[1][1] + board[2][2] == target[t] ){
      for(var y=0; y<3; y++){ if(!board[y][y]){
        result.push([target[t][0], y, y]);} }
    }
    if( board[0][2] + board[1][1] + board[2][0] == target[t] ){
      for(var y=0; y<3; y++){ if(!board[y][2-y]){
        result.push([target[t][0], y, 2-y]);} }
    }
  }
  return result;
}

function getRandomSquare(){
  function getEmptySquares(){
    var empty = [];
    for(var x=0; x<3; x++){ for(var y=0; y<3; y++){
      if(!board[x][y]){ empty.push([x, y]); }
    }}
    return empty;
  }

  if( !board[1][1] ){ return [1, 1]; }
  var emptySquares = [];
  if(arguments[0]){
    var target = arguments[0];
    for(var s=0; s<target.length; s++){
      if(!board[target[s][0]][target[s][1]]){
        emptySquares.push(target[s]);
      }
    }
    if(!emptySquares[0]){ emptySquares = getEmptySquares(); }
  }else {
    emptySquares = getEmptySquares();
  }
  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
}


var corners = [ [0, 0], [0, 2], [2, 0], [2, 2] ];
var middles = [ [0, 1], [2, 1], [1, 0], [1, 2] ];

function getCenterStrategy(){
  var targets  = [];

  if( board[1][1] == player1 ){ targets = corners; }
  if( board[1][1] == player2 ){
    targets = middles.slice();
    if( board[0][1] == player1 || board[2][1] == player1 ){
      targets.shift(); targets.shift();
    }
    if( board[1][0] == player1 || board[1][2] == player1 ){
      targets.pop(); targets.pop();
    }
    if(!targets[0]){ targets = corners; }
  }
  return getRandomSquare(targets);
}

var playCorner = true;
function getCornerStrategy(){
  if(playCorner){
    playCorner = false;
    var tMiddles = middles.filter(function(middle){
      return board[middle[0]][middle[1]] == player1;
    });
    if(tMiddles[0]){
      var target = corners.filter(function(corner){
        for(var t=0; t<tMiddles.length; t++){
          if(tMiddles[t][0] == corner[0] || tMiddles[t][1] == corner[1]){
            return true;
          }
        }
      });
      //console.log(target);
      return target[Math.floor(Math.random() * target.length)];
    }
  }
  return getRandomSquare();
}
