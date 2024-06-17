import { CATEGORY_LIST } from "../../consts/category-list.js";
import { Randomizer } from "../../utils/randomizer.js";
import { Cookie } from "../../utils/cookie.js";

const TRIVIA_URL = "https://opentdb.com/api.php?amount=1&difficulty=easy";
const CATEGORY_URL = "https://opentdb.com/api_category.php";
const TOKEN_URL = "https://opentdb.com/api_token.php?command=request";

let CATEGORY_LIST_ID = [];
let API_SESSION_TOKEN = "";

class TriviaGame {
  #newGameButton;
  #cancelGameButton;
  #scoreInfo;
  #questionPanel;
  #questionStatement;
  #questionList;
  #formRankingPanel;

  #started;
  #gameOver;
  #score;
  #questionIndex;
  #currentCorrectAnswer;

  constructor(
    newGameButton,
    cancelGameButton,
    scoreInfo,
    questionPanel,
    questionStatement,
    questionList,
    formRankingPanel
  ) {
    this.#newGameButton = newGameButton;
    this.#cancelGameButton = cancelGameButton;
    this.#scoreInfo = scoreInfo;
    this.#questionPanel = questionPanel;
    this.#questionStatement = questionStatement;
    this.#questionList = questionList;
    this.#formRankingPanel = formRankingPanel;

    this.#init();
  }

  #init() {
    this.#setEventListeners();
    this.#fetchCategories();
    this.#fetchSessionToken();
    this.#reset();
  }

  #reset() {
    this.#started = false;
    this.#gameOver = false;
    this.#score = 0;
    this.#questionIndex = 0;
    this.#render();
  }

  #setEventListeners() {
    this.#newGameButton.addEventListener("click", this.#newGame.bind(this));
    this.#cancelGameButton.addEventListener("click", this.#cancelGame.bind(this));

    const questions = this.#questionList.querySelectorAll("li");
    questions.forEach((element) => {
      element.addEventListener("click", (event) => {
        this.#checkAnswer(element);
      });
    });
  }

  #fetchCategories() {
    const storedCategoryList = Cookie.getCookie("CATEGORY_LIST_ID");
    CATEGORY_LIST_ID = storedCategoryList ? storedCategoryList.split("-") : [];

    if (CATEGORY_LIST_ID.length == 0) {
      fetch(CATEGORY_URL)
        .then((response) => response.json())
        .then((data) => {
          for (const category of data.trivia_categories) {
            if (CATEGORY_LIST.includes(category.name)) {
              CATEGORY_LIST_ID.push(category.id);
            }
          }
          CATEGORY_LIST_ID = Randomizer.randomizeArray(CATEGORY_LIST_ID);
          Cookie.setCookie("CATEGORY_LIST_ID", CATEGORY_LIST_ID.join("-"));
          console.log("Categories fetched and stored in a session cookie!");
        });
    }
  }

  #fetchSessionToken() {
    const storedToken = Cookie.getCookie("API_SESSION_TOKEN");
    API_SESSION_TOKEN = storedToken;

    if (API_SESSION_TOKEN.length == 0) {
      fetch(TOKEN_URL)
        .then((response) => response.json())
        .then((data) => {
          if (data.response_code === 0) {
            API_SESSION_TOKEN = data.token;
            Cookie.setCookie("API_SESSION_TOKEN", API_SESSION_TOKEN, 5);
            console.log("API Session Token fetched and stored in a session cookie!");
          }
        });
    }
  }

  #render() {
    this.#setVisible(this.#newGameButton, !this.#started);
    this.#setVisible(this.#cancelGameButton, this.#started);
    this.#setVisible(this.#questionPanel, this.#started);
    this.#setVisible(this.#formRankingPanel, this.#gameOver);
    
    if (this.#gameOver) {
      this.#questionStatement.innerHTML = "Do you want to save your score in the Ranking?";
      this.#setVisible(this.#questionList, false);
    }

    this.#scoreInfo.innerHTML = this.#score;
  }

  #newGame() {
    if (CATEGORY_LIST_ID.length == 0) {
      this.#fetchCategories();
    }
    this.#reset();
    this.#started = true;
    this.#render();
    this.#askQuestion();
  }

  #cancelGame() {
    this.#reset();
    this.#started = false;
    this.#render();
  }

  #askQuestion(waitSecs = 0) {
    const category = CATEGORY_LIST_ID[this.#questionIndex];
    this.#showLoadingQuestion();
    setTimeout(() => {
      this.#fetchQuestion(category);
    }, waitSecs * 1000);
  }

  #updateQuestion(questionStatement, questionType, correctAnswer, incorrectAnswers) {
    this.#questionStatement.innerHTML = questionStatement;
    this.#setQuestionType(questionType);
    this.#showAnswers(correctAnswer, incorrectAnswers);
  }

  #setQuestionType(questionType) {
    const questions = this.#questionList.querySelectorAll("li");

    if (questionType === "boolean") {
      questions.forEach((element, index) => {
        if (index > 1) {
          element.classList.add("d-none");
        }
      });
    } else {
      questions.forEach((element) => {
        element.classList.remove("d-none");
      });
    }
  }

  #showAnswers(correctAnswer, incorrectAnswers) {
    const answers = [correctAnswer, ...incorrectAnswers];
    this.#currentCorrectAnswer = correctAnswer;
    const randomizedAnswers = Randomizer.randomizeArray(answers);

    const questions = this.#questionList.querySelectorAll("li");
    questions.forEach((element, index) => {
      element.innerHTML = randomizedAnswers[index];
      element.setAttribute("data-value", randomizedAnswers[index]);
    });
  }

  #checkAnswer(selectedAnswer) {
    const answer = selectedAnswer.getAttribute("data-value");
    if (answer === this.#currentCorrectAnswer) {
      this.#score += 2;
    }
    this.#currentCorrectAnswer = "";
    if (this.#questionIndex < CATEGORY_LIST_ID.length) {
      this.#askQuestion(5);
    } else {
      this.#gameOver = true;
    }
    this.#render();
  }

  /**
   * Fetches a question from the API.
   *
   * Possible response codes:
   * Code 0: Success Returned results successfully.
   * Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
   * Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)
   * Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.
   * Code 5: Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.
   */
  #fetchQuestion(category) {
    this.#showLoadingQuestion();
    fetch(this.#getTriviaURL(category))
      .then((response) => {
        if (response.status === 429) {
          this.retryFetchQuestion(category);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.response_code === 0 && data.results.length > 0) {
          const questionStatement = data.results[0].question;
          const questionType = data.results[0].type;
          const correctAnswer = data.results[0].correct_answer;
          const incorrectAnswers = data.results[0].incorrect_answers;

          this.#setVisible(this.#questionList, true);
          this.#updateQuestion(questionStatement, questionType, correctAnswer, incorrectAnswers);
          this.#questionIndex++;
          console.log("Fetched question!");
        } else if (data && data.response_code === 3) {
          // No valid token, fetch a new one
          Cookie.deleteCookie("API_SESSION_TOKEN");
          this.#fetchSessionToken();
          this.retryFetchQuestion(category);
          console.log("No valid token, fetching a new one...");
        } else {
          this.#showLoadingQuestion();
        }
      })
      .catch((error) => {
        console.log("There was an error: ", error);
      });
  }

  retryFetchQuestion(category) {
    console.log("Too many requests. Retrying in 3 seconds...");
    setTimeout(() => {
      this.#fetchQuestion(category);
    }, 3000);
  }

  #showLoadingQuestion() {
    this.#setVisible(this.#questionList, false);
    this.#questionStatement.innerHTML = "Loading next question...";
  }

  #getTriviaURL = (category) => `${TRIVIA_URL}&category=${category}&token=${API_SESSION_TOKEN}`;

  #setVisible(element, isVisible) {
    if (isVisible) {
      element.classList.remove("d-none");
    } else {
      element.classList.add("d-none");
    }
  }

  /* Public functions */

  startGame() {
    this.#newGame();
  }

  endGame() {
    this.#cancelGame();
  }

  getScore() {
    return this.#score;
  }
}

export { TriviaGame };
