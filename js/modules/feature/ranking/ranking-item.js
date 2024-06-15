export class RankingItem {
  #rankingPlayer;

  constructor(rankingPlayer) {
    this.#rankingPlayer = rankingPlayer;
  }

  render() {
    return `
      <li class="scoreboard__item">
        <p class="scoreboard__pos">${this.#rankingPlayer.position}</p>
        <p class="scoreboard__name">${this.#rankingPlayer.name}</p>
        <p class="scoreboard__points">${this.#rankingPlayer.score} pts</p>
    </li>
          `;
  }
}
