var drumButton = document.querySelectorAll(".drum");

for(var i=0; i<drumButton.length; i++){
    drumButton[i].addEventListener("click", clickResp);
}

document.addEventListener("keydown", keyResp);

function clickResp (event){
    var btnName = event.path[0].innerHTML;
    makeSound(btnName);

    buttonAnimation(btnName);
}

function keyResp(event){
    var key = event.key;
    makeSound(key);

    buttonAnimation(key);
}

function makeSound(sel){
    var audioURL = "sounds/";
    switch (sel) {
        case "w":
            audioURL += "crash.mp3";
            break;
    
        case "a":
            audioURL += "kick-bass.mp3";
            break;
    
        case "s":
            audioURL += "snare.mp3";
            break;

        case "d":
            audioURL += "tom-1.mp3";
            break;

        case "j":
            audioURL += "tom-2.mp3";
            break;

        case "k":
            audioURL += "tom-3.mp3";
            break;

        case "l":
            audioURL += "tom-4.mp3";
            break;

        default:
            console.log("invalid input!");
            break;
    }
    var audio = new Audio(audioURL);
    audio.play();
}

function buttonAnimation(currentkey) {
    var activebutton = document.querySelector("." + currentkey);
    activebutton.classList.add("pressed");
    setTimeout(function (){
        activebutton.classList.remove("pressed");
    }, 100);
}