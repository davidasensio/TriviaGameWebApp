/**
 * Practice - WebProgramming
 * @author David Asensio - June 2024
 */
import { TriviaGame } from "./modules/game/trivia-game.js";

const newGameButton = document.querySelector(".js-new");
const cancelGameButton = document.querySelector(".js-cancel");
const scoreInfo = document.querySelector(".js-points");
const questionPanel = document.querySelector(".question");
const questionStatement = document.querySelector(".question__statement");
const questionAnswers = document.querySelector(".question__answers");
const formRankingPanel = document.querySelector(".score");

new TriviaGame(
  newGameButton,
  cancelGameButton,
  scoreInfo,
  questionPanel,
  questionStatement,
  questionAnswers,
  formRankingPanel
);
