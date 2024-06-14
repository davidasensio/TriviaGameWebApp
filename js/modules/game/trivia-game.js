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
    this.#reset();
    this.#newGameButton.addEventListener("click", this.#newGame.bind(this));
    this.#cancelGameButton.addEventListener(
      "click",
      this.#cancelGame.bind(this)
    );

    this.#reset();
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
}

export { TriviaGame };
