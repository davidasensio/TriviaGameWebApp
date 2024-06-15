import { Cookie } from "../../utils/cookie.js";
import { RankingItem } from "./ranking-item.js";
import { RankingPlayer } from "./ranking-player.js";

let ranking = [];

class Ranking {
  #rankingEmptyMessage;
  #rankingPlayerList;

  constructor(rankingEmptyMessage, rankingPlayerList) {
    this.#rankingEmptyMessage = rankingEmptyMessage;
    this.#rankingPlayerList = rankingPlayerList;

    this.#init();
  }

  #init() {
    const rankingCookie = Cookie.getCookie("ranking");
    if (rankingCookie !== "") {
      try {
        ranking = JSON.parse(rankingCookie);
      } catch (error) {
        console.log("Error parsing ranking cookie", error);
      }
    }
    this.#render();
  }

  #render() {
    this.#setVisible(this.#rankingEmptyMessage, ranking.length === 0);
    this.#setVisible(this.#rankingPlayerList, ranking.length !== 0);
    this.#rankingPlayerList.innerHTML = ranking.map((rankingPlayer) => new RankingItem(rankingPlayer).render()).join("");
  }

  #setVisible(element, isVisible) {
    if (isVisible) {
      element.classList.remove("d-none");
    } else {
      element.classList.add("d-none");
    }
  }

  addToRanking(userName, userRankingScore) {
    const rankingPlayer = new RankingPlayer(userName, userRankingScore, 3);
    ranking.push(rankingPlayer);
    ranking.sort((a, b) => b.score - a.score);
    for (let i = 0; i < ranking.length; i++) {
      ranking[i].position = i + 1;
    }
    Cookie.setCookie("ranking", JSON.stringify(ranking), 365); // 1 year persistence cookie
    this.#render();
  }
}

export { Ranking };
