import React from "react";
import { usePortal } from "@utils/hooks/usePortal";
import { RANKING_OF_HANDS } from "@utils/constants";
import { Hand } from "@components/Mode/Shared/Hand/Hand";
import { RANKING_OF_HANDS_KEYS } from "@utils/common/types";
import { Cube } from "@components/Mode/Shared/Desk/Cube/Cube";

export const Rules = () => {
  const portal = usePortal();

  return portal(
    <div className="rules">
      <span className="rules__title">Rules</span>
      <div className="rules__content">
        <span className="rules__subtitle">Basics</span>

        <ul className="rules__list">
          <li>Each player uses a set of five dice.</li>
          <li>The goal of the game is to roll the highest-ranking hand.</li>
          <li>Select any dice you wish to re-roll.</li>
          <li>The player with the highest-ranking hand wins.</li>
          <li>
            If both players end with all five dice matching, it's win of round
            for both players.
          </li>
        </ul>

        <span className="rules__subtitle">Ranking of Hands</span>

        <div className="rules__rankings ranking">
          <span className="ranking__title">
            {RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND].name}
          </span>
          <p className="ranking__description">
            Hand that contains five dice of one rank, like in example below:
          </p>
          <Hand
            player="Player"
            ranking={
              RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.FIVE_OF_A_KIND].name
            }
          >
            {[1, 1, 1, 1, 1].map((cube, index) => (
              <Cube key={index} isDisabled value={cube} />
            ))}
          </Hand>
          <p className="ranking__description">
            Each five of a kind is ranked by the rank of its quintuplet.
          </p>
        </div>

        <div className="rules__rankings ranking">
          <span className="ranking__title">
            {RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND].name}
          </span>
          <p className="ranking__description">
            Hand that contains four dice of one rank and one card of another
            rank (the kicker), like in example below:
          </p>
          <Hand
            player="Player"
            ranking={
              RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.FOUR_OF_A_KIND].name
            }
          >
            {[1, 1, 1, 1, 2].map((cube, index) => (
              <Cube key={index} isDisabled value={cube} />
            ))}
          </Hand>
          <p className="ranking__description">
            Each four of a kind is ranked first by the rank of its quadruplet,
            and then by the rank of its kicker.
          </p>
        </div>

        <div className="rules__rankings ranking">
          <span className="ranking__title">
            {RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.FULL_HOUSE].name}
          </span>
          <p className="ranking__description">
            Hand that contains three dice of one rank and two dice of another
            rank, like in example below:
          </p>
          <Hand
            player="Player"
            ranking={RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.FULL_HOUSE].name}
          >
            {[1, 1, 1, 2, 2].map((cube, index) => (
              <Cube key={index} isDisabled value={cube} />
            ))}
          </Hand>
          <p className="ranking__description">
            Each full house is ranked first by the rank of its triplet, and then
            by the rank of its pair.
          </p>
        </div>

        <div className="rules__rankings ranking">
          <span className="ranking__title">
            {RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.SIX_HIGH_STRAIGHT].name}
          </span>
          <p className="ranking__description">
            Hand that contains five dice of sequence from 2 to 6, like in
            example below:
          </p>
          <Hand
            player="Player"
            ranking={
              RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.SIX_HIGH_STRAIGHT].name
            }
          >
            {[2, 3, 4, 5, 6].map((cube, index) => (
              <Cube key={index} isDisabled value={cube} />
            ))}
          </Hand>
        </div>

        <div className="rules__rankings ranking">
          <span className="ranking__title">
            {RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT].name}
          </span>
          <p className="ranking__description">
            Hand that contains five dice of sequence from 1 to 5, like in
            example below:
          </p>
          <Hand
            player="Player"
            ranking={
              RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.FIVE_HIGH_STRAIGHT].name
            }
          >
            {[1, 2, 3, 4, 5].map((cube, index) => (
              <Cube key={index} isDisabled value={cube} />
            ))}
          </Hand>
        </div>

        <div className="rules__rankings ranking">
          <span className="ranking__title">
            {RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND].name}
          </span>
          <p className="ranking__description">
            Hand that contains three dice of one rank and two dice of two other
            ranks (the kicker), like in example below:
          </p>
          <Hand
            player="Player"
            ranking={
              RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.THREE_OF_A_KIND].name
            }
          >
            {[1, 1, 1, 2, 3].map((cube, index) => (
              <Cube key={index} isDisabled value={cube} />
            ))}
          </Hand>
          <p className="ranking__description">
            Each three of a kind is ranked first by the rank of its triplet,
            then by the rank of its highest-ranking kicker, and finally by the
            rank of its lowest-ranking kicker.
          </p>
        </div>

        <div className="rules__rankings ranking">
          <span className="ranking__title">
            {RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.TWO_PAIRS].name}
          </span>
          <p className="ranking__description">
            Hand that contains two cards of one rank, two dice of another rank
            and one die of a third rank (the kicker), like in example below:
          </p>
          <Hand
            player="Player"
            ranking={RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.TWO_PAIRS].name}
          >
            {[1, 1, 2, 2, 3].map((cube, index) => (
              <Cube key={index} isDisabled value={cube} />
            ))}
          </Hand>
          <p className="ranking__description">
            Each two pair is ranked first by the rank of its higher-ranking
            pair, then by the rank of its lower-ranking pair, and finally by the
            rank of its kicker.
          </p>
        </div>

        <div className="rules__rankings ranking">
          <span className="ranking__title">
            {RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.PAIR].name}
          </span>
          <p className="ranking__description">
            Hand that contains two dice of one rank and three dice of three
            other ranks (the kickers), like in example below:
          </p>
          <Hand
            player="Player"
            ranking={RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.PAIR].name}
          >
            {[1, 1, 2, 3, 4].map((cube, index) => (
              <Cube key={index} isDisabled value={cube} />
            ))}
          </Hand>
          <p className="ranking__description">
            Each one pair is ranked first by the rank of its pair, then by the
            rank of its highest-ranking kicker, then by the rank of its second
            highest-ranking kicker, and finally by the rank of its
            lowest-ranking kicker.
          </p>
        </div>

        <div className="rules__rankings ranking">
          <span className="ranking__title">
            {RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.NOTHING].name}
          </span>
          <p className="ranking__description">
            Hand that does not fall into any other category, like in example
            below:
          </p>
          <Hand
            player="Player"
            ranking={RANKING_OF_HANDS[RANKING_OF_HANDS_KEYS.NOTHING].name}
          >
            {[1, 2, 3, 4, 6].map((cube, index) => (
              <Cube key={index} isDisabled value={cube} />
            ))}
          </Hand>
          <p className="ranking__description">
            Each high die hand is ranked first by the rank of its
            highest-ranking die, then by the rank of its second highest-ranking
            die, then by the rank of its third highest-ranking card, then by the
            rank of its fourth highest-ranking die, and finally by the rank of
            its lowest-ranking die.
          </p>
        </div>
      </div>
    </div>,
    document.getElementsByClassName("menu__overlay")[0]
  );
};
