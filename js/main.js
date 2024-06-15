/**
 * Practice - WebProgramming
 * @author David Asensio - June 2024
 * 
 * I also have published the practice temporary to a GitHub repository, just in case anyone wants to try it.
 * @see https://davidasensio.github.io/TriviaGameWebApp
 */
import { TriviaGame } from "./modules/feature/game/trivia-game.js";
import { Ranking } from "./modules/feature/ranking/ranking.js";

// Trivia Game
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

// Ranking
const rankingEmptyMessage = document.querySelector(".ranking__message");
const rankingPlayerList = document.querySelector(".scoreboard");

const ranking = new Ranking(rankingEmptyMessage, rankingPlayerList);

// Form Ranking
const form = document.forms["form_ranking_data"];
form.addEventListener("submit", (event) => {
  const formData = new FormData(form);
  const userName = formData.get("username");
  const userRankingScore = triviaGame.getScore();

  event.preventDefault();
  ranking.addToRanking(userName, userRankingScore);
  triviaGame.endGame();
});

form.addEventListener("reset", (event) => {
  triviaGame.endGame();
});
