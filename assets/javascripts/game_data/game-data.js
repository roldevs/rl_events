import {createUI} from "./ui.js";
import {VERSION} from "./constants.js";

const gameData = document.querySelector('.js__game-data');
gameData && createUI(VERSION);
