// state
//  score
//  player pick
//  ai pick

const playerWinsLSKey = "playerWins";
const AIWinsLSKey = "AIWins";

const winningResultsMap = {
    paper: ['rock'],
    rock: ['scissors'],
    scissors: ['paper'],
};

let state = {
    playerWins: Number(localStorage.getItem(playerWinsLSKey)) || 0,
    AIWins: Number(localStorage.getItem(AIWinsLSKey)) || 0,
    playerPick: null,
    AIPick: null,
};

const renderScore = () => {
    const pointsElement = document.querySelector(".points");
    pointsElement.innerText = state.playerWins - state.AIWins;
};

const bindPickEvent = () => {
    document.querySelectorAll(".options button").forEach((button) => {
        button.addEventListener("click", pick);
    });

    document.querySelector(".result__button").addEventListener("click", reset);
};

const pick = (e) => {
    pickByPlayer(e.currentTarget.dataset.pick);
    pickByAI();
    hideOptions()
    showFight();
};

const pickByPlayer = (pickedOption) => {
    state = {
        ...state,
        playerPick: pickedOption,
    }
};

const pickByAI = () => {
    const options = ["rock", "paper", 'scissors']
    const AIPick = options[Math.floor(Math.random() * options.length)]

    state = {
        ...state,
        AIPick,
    }
};

const hideOptions = () => {
    const optionsElement = document.querySelector(".options");
    optionsElement.classList.add("slide-left");
};

const showFight = () => {
    const fightElement = document.querySelector(".fight");
    fightElement.classList.add("slide-left");
    fightElement.classList.remove("hidden");
    createElementPickedByPlayer();
    createElementPickedByAI();
    
    document.querySelectorAll(".options button").forEach((button) => {
        button.setAttribute("tabindex", -1);
    });
    document.querySelector(".result__button").setAttribute("tabindex",0);

    showResult();
};

const showResult = () => {

    const resultTextElement = document.querySelector(".result__text")

    if (state.playerPick === state.AIPick) {
        resultTextElement.innerText = "DRAW"
        console.log('draw')
    } else if (winningResultsMap[state.playerPick].includes(state.AIPick)) {
        resultTextElement.innerText = "YOU WIN"
        localStorage.setItem(playerWinsLSKey, state.playerWins + 1)
        state = {
            ...state,
            playerWins: state.playerWins + 1,
        }
        console.log('player wins')
    } else {
        resultTextElement.innerText = "YOU LOSE"
        localStorage.setItem(AIWinsLSKey, state.AIWins + 1)
        state = {
            ...state,
            AIWins: state.AIWins + 1,
        }
        console.log('ai wins')
    }

    setTimeout(renderResult, 500);

    renderScore();
};

const renderResult = () => {
    document.querySelector(".result").classList.add("shown");
    document.querySelector(".pick--player").classList.add("moved");
    document.querySelector(".pick--ai").classList.add("moved");
};

const createElementPickedByPlayer = () => {
    const playerPick = state.playerPick;

    const pickContainerElement = document.querySelector(
        ".pick__container--player"
    );
    pickContainerElement.innerHTML = "";
    pickContainerElement.appendChild(createPickElement(playerPick));
};

const createElementPickedByAI = () => {
    const AIPick = state.AIPick;

    const pickContainerElement = document.querySelector(
        ".pick__container--ai"
    );
    pickContainerElement.innerHTML = "";
    pickContainerElement.appendChild(createPickElement(AIPick));
};

const createPickElement = (option) => {
    const pickElement = document.createElement("div");
    pickElement.classList.add("button", `button--${option}`);

    const imageContainerElement = document.createElement("div");
    imageContainerElement.classList.add("button__image-container")

    const imgElement = document.createElement("img");
    imgElement.src = `./images/icon-${option}.svg`;
    imgElement.alt = option;

    imageContainerElement.appendChild(imgElement);

    pickElement.appendChild(imageContainerElement);

    return pickElement;
}


const reset = () => {
    const fightElement = document.querySelector(".fight");
    fightElement.classList.remove("slide-left");

    const optionsElement = document.querySelector(".options");
    optionsElement.classList.remove("slide-left");

    const resultTextElement = document.querySelector(".result");
    resultTextElement.classList.remove("shown");


    const pickPlayerElement = document.querySelector(".pick--player");
    pickPlayerElement.classList.remove("moved")
    const pickAIElement = document.querySelector(".pick--ai");
    pickAIElement.classList.remove("moved")  

    document.querySelectorAll(".options button").forEach((button) => {
        button.setAttribute("tabindex", 0);
    });

    

    document.querySelector(".result__button").setAttribute("tabindex",-1);
}

const init =  () => {
    localStorage.clear();
    renderScore();
    bindPickEvent();
};

init();