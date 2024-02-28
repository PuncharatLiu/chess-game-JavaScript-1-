import { TAKE, turn } from "../move-control/piecesControl.js";
import {
  overlapBlack,
  overlapWhite,
  changeDefualtPosition,
} from "../position/position.js";
import { pieces } from "../pieces/pieces.js";
import PGN from "../notation/PGN.js";

export function capture(getFilePosition, getRankPosition, filePart, rankPart) {
  const storeFR = filePart + rankPart;
  const pgn = new PGN();

  // console.log(storeFR);
  if (turn === "white") {
    if (overlapBlack.includes(storeFR)) {
      let getEnemyPosition = document.querySelector(
        `[position="${filePart}${rankPart}"]`,
      );
      let getEnemyId = getEnemyPosition.id;

      let getEnemyElement = document.getElementById(getEnemyId);
      getEnemyElement.setAttribute("position", "taken");

      if (getEnemyPosition) {
        getEnemyPosition.style.transform = `translate(${-1000}px, ${-1000}px)`;

        pieces[getEnemyId].position.file = -1000;
        pieces[getEnemyId].position.rank = -1000;
        changeDefualtPosition(
          getFilePosition,
          getRankPosition,
          filePart,
          rankPart,
        );
        TAKE(true);
        return true;
      }
    }
  } else {
    if (overlapWhite.includes(storeFR)) {
      let getEnemyPosition = document.querySelector(
        `[position="${filePart}${rankPart}"]`,
      );
      let getEnemyId = getEnemyPosition.id;

      let getEnemyElement = document.getElementById(getEnemyId);
      getEnemyElement.setAttribute("position", "taken");

      if (getEnemyPosition) {
        getEnemyPosition.style.transform = `translate(${-1000}px, ${-1000}px)`;

        pieces[getEnemyId].position.file = -1000;
        pieces[getEnemyId].position.rank = -1000;
        changeDefualtPosition(
          getFilePosition,
          getRankPosition,
          filePart,
          rankPart,
        );

        // take = true;
        TAKE(true);
        //pgn.capture(true);

        return true;
      }
    }
  }
  changeDefualtPosition(getFilePosition, getRankPosition, filePart, rankPart);
}