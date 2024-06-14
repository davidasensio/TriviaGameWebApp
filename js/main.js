/**
 * Practice - WebProgramming
 * @author David Asensio
 */

import { CATEGORY_LIST } from "./modules/consts/category-list.js";
import { Encoder } from "./modules/utils/encoder.js";
import { Randomizer } from "./modules/utils/randomizer.js";
import { TriviaGame } from "./modules/game/trivia-game.js";

console.log(CATEGORY_LIST);
console.log(Encoder.htmlEntitiesEncode("Hello World!"));
console.log(Randomizer.randomizeArray(["a", "b", "c", "d", "e", "f", "g", "h", "i"]));

const newGameButton = document.querySelector(".js-new");
const cancelGameButton = document.querySelector(".js-cancel");
const scoreInfo = document.querySelector(".js-points");

new TriviaGame(newGameButton, cancelGameButton, scoreInfo);
