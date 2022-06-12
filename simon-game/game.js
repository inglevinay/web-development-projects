var gamePattern = [];
var userClickedPattern = [];

var buttonColours = ["red", "blue", "green", "yellow"];

$(document).on("keydown", touchdown);

function touchdown(e){
    var level = 0;
    gamePattern = [];
    userClickedPattern = [];
    $("h1").text("Level 0");

    $(document).off("keydown");

    $(".btn").on("click", function(){
        var userChosenColour = $(this).attr("id");
        userClickedPattern.push(userChosenColour);
    
        playSound(userChosenColour);
     
        animatePress(userChosenColour);
    
        checkAnswer();
    
        if(userClickedPattern.length == gamePattern.length){
            setTimeout(nextSequence, 1000);
            userClickedPattern = [];
        }
        
        return userChosenColour;
    });
    
    setTimeout(nextSequence, 1000);
}


function nextSequence() {
    var rnd = Math.floor(Math.random()*4);

    var randomChosenColour = buttonColours[rnd];
    gamePattern.push(randomChosenColour);
    var colourId = "#" + randomChosenColour;

    $(colourId).fadeIn(100).fadeOut(100).fadeIn(100);

    playSound(randomChosenColour);
    updateLevel();
    return rnd;
}

function playSound(name){
    var soundUrl = "sounds/" + name + ".mp3"

    var audio = new Audio(soundUrl);
    audio.play();
}

function animatePress(currentColour){
    $("#" + currentColour).addClass("pressed");
    
    setTimeout(function(){
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

function updateLevel(){
    var leveltext = $("h1").text();
    var level = leveltext.split(" ");
    var newLevel = level[level.length - 1];

    if(newLevel === NaN) gameOver();
    newLevel++;
    $("h1").text("Level "+ newLevel);
}

function checkAnswer(){
    console.clear();
    console.log(userClickedPattern);
    console.log(gamePattern);
    console.log(userClickedPattern[userClickedPattern])
    if(userClickedPattern[userClickedPattern.length-1] === gamePattern[userClickedPattern.length-1]){
        console.log("success");
    }
    else{
        console.log("wrong");
        gameOver();
    }
}

function gameOver(){
    playSound("wrong");

    $("h1").text("Game Over! Press Any Key To Restart");
    $("body").addClass("game-over");

    $(".btn").off("click");
    $(document).on("keydown", touchdown);

    setTimeout(function(){
    $("body").removeClass("game-over");
    }, 200);
    
}