import { RANKING_OF_HANDS } from "@src/utils/constants";
import React from "react";

export const Rules = () => {
  return (
    <div className="rules">
      <span className="rules__title">Rules</span>
      <div className="rules__content">
        <span className="rules__subtitle">Basics</span>

        <ul className="rules__list">
          <li>Each player uses a set of five dice.</li>
          <li>Bet levels are based on the experience of the players.</li>
          <li>
            The goal of the game is to roll the strongest hand in two out of
            three hands.
          </li>
          <li>Place your bet and left-click "roll dice".</li>
          <li>Choose whether to raise the bet.</li>
          <li>Select any dice you wish to re-roll.</li>
          <li>The player with the highest-ranking hand wins.</li>
        </ul>

        <span className="rules__subtitle">Ranking of Hands</span>

        <ul className="rules__list">
          {Object.entries(RANKING_OF_HANDS).map(([key, ranking]) => (
            <li key={key}>
              <b>{ranking.name}</b>
              {" - "}
              <span>{ranking.description}</span>
            </li>
          ))}
        </ul>

        <span className="rules__subtitle">Playthrough</span>

        <p className="rules__paragraph">
          Each game has two rounds and each round has two rolls. Geralt always
          starts. Between rounds each player who can afford to may raise the bet
          once. After Geralt makes this decision, the opponent can surrender,
          accept or raise (re-raise); surrendering is effectively forfeiting the
          round. If (after both re-roll decisions) both hands match, the highest
          face-value prevails: e.g. if you have a Pair of 3s and your opponent
          has a Pair of 4s, you lose. 'Extra' dice (in the case of Pairs or
          Three-/Four-of-a-Kind) are only considered if matching hands are
          identical: e.g. if each player has four 6s, your fifth die is a 3 and
          your opponent's is a 1, you win. If both players end with all five
          dice matching, it's a draw; this adds another chance to raise the
          stakes and re-roll, and though rare, can happen more than once per
          game, dragging it out until one hand exceeds the other.
        </p>
      </div>
    </div>
  );
};
