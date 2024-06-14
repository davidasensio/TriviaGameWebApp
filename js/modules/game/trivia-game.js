import { CATEGORY_LIST } from "../consts/category-list.js";

const TRIVIA_URL = "https://opentdb.com/api.php?amount=1&difficulty=easy";
const CATEGORY_URL = "https://opentdb.com/api_category.php";
const TOKEN_URL = "https://opentdb.com/api_token.php?command=request";
const CATEGORY_LIST_ID = [];

class TriviaGame {
  #newGameButton;
  #cancelGameButton;
  #scoreInfo;

  #started;
  #score;

  constructor(newGameButton, cancelGameButton, scoreInfo) {
    this.#newGameButton = newGameButton;
    this.#cancelGameButton = cancelGameButton;
    this.#scoreInfo = scoreInfo;

    this.#init();
  }

  #init() {
    this.#newGameButton.addEventListener("click", this.#newGame.bind(this));
    this.#cancelGameButton.addEventListener("click", this.#cancelGame.bind(this));

    this.#reset();
    this.#fetchCategories();
  }

  #reset() {
    this.#started = false;
    this.#score = 0;
    this.#render();
  }

  #newGame() {
    console.log("New Game");
    alert("New Game");
    this.#started = true;
    this.#render();
  }

  #cancelGame() {
    this.#started = false;
    console.log("Cancel Game");
    alert("Cancel Game");
    this.#render();
  }

  #render() {
    console.log("Render");
    if (this.#started) {
      this.#newGameButton.classList.add("d-none");
      this.#cancelGameButton.classList.remove("d-none");
    } else {
      this.#newGameButton.classList.remove("d-none");
      this.#cancelGameButton.classList.add("d-none");
    }
    this.#scoreInfo.innerHTML = this.#score;
  }
  /** Fetch API functions */

  #fetchCategories() {
    if (CATEGORY_LIST_ID.length == 0) {
      fetch(CATEGORY_URL)
        .then((response) => response.json())
        .then((data) => {
          const result = data.trivia_categories.map((item) => `${item.id} - ${item.name}`).join("\n");
          for (const category of data.trivia_categories) {
            if (CATEGORY_LIST.includes(category.name)) {
              CATEGORY_LIST_ID.push(category.id);
            }
          }
          alert("Fetched categories! ");
        });
    }
  }
}

export { TriviaGame };
