var randomNumber1 = Math.ceil(Math.random()*6);
var randomNumber2 = Math.ceil(Math.random()*6);

var newdie1src = "images/dice"+randomNumber1+".png";
var newdie2src = "images/dice"+randomNumber2+".png";

var diceimages = document.querySelectorAll("img");

diceimages[0].setAttribute("src", newdie1src);
diceimages[1].setAttribute("src", newdie2src);

if(randomNumber1 == randomNumber2){
    document.querySelector("h1").innerHTML = "Draw!";
}
else if(randomNumber1 > randomNumber2){
    document.querySelector("h1").innerHTML = "Player1 wins!";
}
else{
    document.querySelector("h1").innerHTML = "Player2 wins!";
}