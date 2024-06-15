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

const triviaGame = new TriviaGame(
  newGameButton,
  cancelGameButton,
  scoreInfo,
  questionPanel,
  questionStatement,
  questionAnswers,
  formRankingPanel
);

const form = document.forms["form_ranking_data"];
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("username");
  console.log(name);
  // TODO: Implement the logic to store the player's name and score in the ranking
});

form.addEventListener("reset", (event) => {
  triviaGame.cancelGame();
});
