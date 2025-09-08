//Handles the validation of input, and the memory game logic.

const MIN_VALUE = 3;
const MAX_VALUE = 7;
const BUTTON_WIDTH = "10em";
const BUTTON_HEIGHT = "5em";
const HEX_COLOR = '0123456789ABCDEF';
const HEX_BASE = 16;
const HEX_CODE_LENGTH = 6;
const MILLISECONDS = 1000;

class FormValidator {
    constructor(input, errorMsg) {
        this.input = input;
        this.errorMsg = errorMsg;
    }
}

document.getElementById("gameStart").addEventListener("submit", function(event){
    //stop the page from reloading
    event.preventDefault();
    
    const validForm = new FormValidator(
        parseInt(document.getElementById("numberEntry").value),
        ERROR_MESSAGE
    );
    const errorMsg = document.getElementById("errorMessage");

    if(validForm.input < MIN_VALUE || validForm.input > MAX_VALUE) {
        //clear current error message and display new one
        errorMsg.innerHTML = ""; 
        errorMsg.innerHTML = validForm.errorMsg;
    } else {
        errorMsg.innerHTML = "";
        let myGame = new Game(validForm.input)
        myGame.memoryGame(validForm.input);
    }
})

//The individual buttons that appear in the game.
class MemoryButton {
    constructor(number, game) {
        this.number = number;
        this.game = game;
        this.numVisible = true;

        this.btn = document.createElement("button");
        this.btn.style.width = BUTTON_WIDTH;
        this.btn.style.height = BUTTON_HEIGHT;
        this.showNumber()
        this.btn.style.backgroundColor = this.getRandomColor();

        document.getElementById("gameArea").appendChild(this.btn);        
    }

    becomeActive() {
            this.numVisible = false;
            this.btn.innerHTML = "";
            this.btn.addEventListener("click", () => this.sendNumber());
        }

    sendNumber() {
        this.game.checkOrder(this.number - 1);
    }

    showNumber() {
            this.numVisible = true;
            this.btn.innerHTML = this.number;
            this.btn.removeEventListener("click", () => this.sendNumber());
        }

    setPosition(xPos, yPos) {
            this.btn.style.position = "absolute";
            this.btn.style.top = yPos + "px";
            this.btn.style.left = xPos + "px";
        }

    getRandomColor() {
            let myColor = '#';

            for (let i = 0; i < HEX_CODE_LENGTH; i++) {
                myColor += HEX_COLOR[Math.floor(Math.random() * HEX_BASE)]
            }
            return myColor;
        }
}

//
class Game {
    constructor(numButtons) {
        this.numButtons = numButtons;
        this.currentButton = 0;
        this.buttonArr = [];
    }

    shuffleButtons() {
        for(let i = 0; i < this.buttonArr.length; i++) {

            let xPos = Math.floor(Math.random() * 
            (window.innerWidth - this.buttonArr[i].btn.offsetWidth));
            let yPos = Math.floor(Math.random() * 
            (window.innerHeight - this.buttonArr[i].btn.offsetHeight));

            this.buttonArr[i].setPosition(xPos, yPos);
        }
    }

    gameReady() {
        for(let i = 0; i < this.buttonArr.length; i++) {
            this.buttonArr[i].becomeActive();
        }
    }

    checkOrder(number) {
        const gameArea = document.getElementById("gameArea")

        if(number == this.currentButton){
            this.buttonArr[number].showNumber();
            this.currentButton++;
        } else if (number > this.currentButton) {
            for(let i = this.currentButton; this.currentButton < this.buttonArr.length; i++){
                this.buttonArr[i].showNumber();
                document.getElementById("errorMessage").innerHTML = GAME_OVER;
            }
            
        }
        if(this.currentButton == this.numButtons) {
            gameArea.innerHTML = WIN_MESSAGE;
        } 
    }

    memoryGame(number) {
    const gameArea = document.getElementById("gameArea");
    gameArea.innerHTML = "";

    for(let i = 1; i <= number; i++) {
        this.buttonArr[i-1] = new MemoryButton(i, this);
    }

    for(let i = 0; i < number; i++) {
        setTimeout(() => {
            this.shuffleButtons();
        }, (i + 1) * this.numButtons * MILLISECONDS);
    }

    setTimeout(() =>{
        this.gameReady();
    }, number * this.numButtons * MILLISECONDS)

}
}

