import { overlapBlack, overlapWhite, whitePieceIndex, blackPieceIndex, getCurrentPosition } from "../position/position.js";
import { isSelfPiece, isOpponentPiece } from "../pieces/pieces.js";

export function calculateAttackSquare() {
  let pieceAttackId, attackFile, attackRank;
  let allPosition = overlapBlack.concat(overlapWhite); // merge black and white position
  let index = 0;
  let turn;
  let blackAttackSquare = [];
  let whiteAttackSquare = [];
  let blackPinDirection = [];
  let whitePinDirection = [];
  let blackKingAtkDirec = [];
  let whiteKingAtkDirec = [];
  let blackKingEscape = [];
  let whiteKingEscape = [];
  let blackPawnBlock = [];
  let whitePawnBlock = [];
  let blackProtectDirection = [];
  let whiteProtectDirection = [];

  function pushSquare(direction, filePosition, rankPosition) {
    if (
      filePosition * 100 > 700 ||
      filePosition * 100 < 0 ||
      rankPosition * 100 < 0 ||
      rankPosition * 100 > 700
    ) {
      return;
    }
    let getAttackSquare = `${filePosition}${rankPosition}`;
    direction.push(getAttackSquare);
  }

  function pushAttackDirection(direction) {
    0 <= index && index <= 15
      ? blackAttackSquare.push(direction)
      : whiteAttackSquare.push(direction);
  }

  function pushPinDirection(direction) {
    0 <= index && index <= 15
      ? blackPinDirection.push(direction)
      : whitePinDirection.push(direction);
  }

  function pushKingAtkDirec(direction) {
    0 <= index && index <= 15
      ? blackKingAtkDirec.push(direction)
      : whiteKingAtkDirec.push(direction);
  }

  function pushKingEscape(direction) {
    0 <= index && index <= 15
      ? blackKingEscape.push(direction)
      : whiteKingEscape.push(direction);
  }

  function pushPawnBlock(direction) {
    0 <= index && index <= 15
      ? blackPawnBlock.push(direction)
      : whitePawnBlock.push(direction);
  }

  function pushProtectDirection(direction) {
    0 <= index && index <= 15
      ? blackProtectDirection.push(direction)
      : whiteProtectDirection.push(direction);
  }

  function ifEmpty(atkDirec, pinDirec) {
    if (atkDirec.length === 1) {
      atkDirec.splice(0, atkDirec.length, ...pinDirec);
    }
  }

  // give piece id
  for (index = 0; index <= 31; index++) {
    index >= 0 && index <= 15 ? (turn = "black") : (turn = "white");
    pieceAttackId = `${turn === "white" ? whitePieceIndex[index - 16] : blackPieceIndex[index]}`;
    let kingPosition = turn === "white" ? overlapWhite[12] : overlapBlack[4];
    [attackFile, attackRank] = allPosition[index].toString().split("");
    [attackFile, attackRank] = allPosition[index].toString().split("");
    attackFile = parseInt(attackFile);
    attackRank = parseInt(attackRank);

    function isKing(file, rank) {
      const pair = `${file}${rank}`;
      let kingPosition = turn === "white" ? overlapBlack[4] : overlapWhite[12];

      if (pair === kingPosition) {
        return true;
      }
    }

    // =============================== Rook move  =========================================== //
    if (
      pieceAttackId === "0" ||
      pieceAttackId === "7" ||
      pieceAttackId === "24" ||
      pieceAttackId === "31"
    ) {
      horizontalVertical();
    }

    // ===================================== Night Move =========================================== //
    else if (
      pieceAttackId === "1" ||
      pieceAttackId === "6" ||
      pieceAttackId === "25" ||
      pieceAttackId === "30"
    ) {
      // knight move in fire and rank position
      const filePosition = [
        attackFile,
        attackFile - 1,
        attackFile + 1,
        attackFile - 1,
        attackFile + 1,
        attackFile - 2,
        attackFile - 2,
        attackFile + 2,
        attackFile + 2,
      ];
      const rankPosition = [
        attackRank,
        attackRank + 2,
        attackRank + 2,
        attackRank - 2,
        attackRank - 2,
        attackRank + 1,
        attackRank - 1,
        attackRank + 1,
        attackRank - 1,
      ];

      // create 7 square default if valid
      let KNIGHT = ["KNIGHT"];
      for (let i = 0; i <= 8; i++) {
        pushSquare(KNIGHT, filePosition[i], rankPosition[i]);
      }
      pushAttackDirection(KNIGHT);
    }

    // ======================================= Bishop move ========================================= //
    else if (
      pieceAttackId === "2" ||
      pieceAttackId === "5" ||
      pieceAttackId === "26" ||
      pieceAttackId === "29"
    ) {
      // create diagonal move
      diagonal();
    }

    // ======================================== Queen move ========================================= //
    else if (pieceAttackId === "3" || pieceAttackId === "27") {
      // create diagonal, horizontal and vertical move
      horizontalVertical();
      diagonal();
    }

    // ========================================= King move ========================================= //
    else if (pieceAttackId === "4" || pieceAttackId === "28") {
      // all king move
      const filePosition = [
        attackFile,
        attackFile,
        attackFile - 1,
        attackFile + 1,
        attackFile - 1,
        attackFile + 1,
        attackFile,
        attackFile - 1,
        attackFile + 1,
      ];
      const rankPosition = [
        attackRank,
        attackRank - 1,
        attackRank - 1,
        attackRank - 1,
        attackRank,
        attackRank,
        attackRank + 1,
        attackRank + 1,
        attackRank + 1,
      ];

      let KING = ["KING"];
      let KINGESCAPE = [];
      let seeSelf = false;
      for (let i = 0; i <= 8; i++) {
        pushSquare(KING, filePosition[i], rankPosition[i]);

        if (
          !isSelfPiece(
            overlapBlack,
            overlapWhite,
            filePosition[i],
            rankPosition[i],
            turn,
          )
        ) {
          pushSquare(KINGESCAPE, filePosition[i], rankPosition[i]);
        }
      }
      pushKingAtkDirec(KING);
      pushKingEscape(KINGESCAPE);
    } // ======================================= Pawn move =========================================== //
    else {
      let PAWN = ["PAWN"];
      let PAWNBLOCK = [];
      if (index >= 8 && index <= 15) {
        // ================================= black pawn ======================================= //
        pushSquare(PAWN, attackFile - 1, attackRank + 1);
        pushSquare(PAWN, attackFile + 1, attackRank + 1);
        pushSquare(PAWNBLOCK, attackFile, attackRank + 1);
      } else if (index >= 16 && index <= 23) {
        // ======================================= White pawn ======================================== //
        pushSquare(PAWN, attackFile - 1, attackRank - 1);
        pushSquare(PAWN, attackFile + 1, attackRank - 1);
        pushSquare(PAWNBLOCK, attackFile, attackRank - 1);
      }
      pushAttackDirection(PAWN);
      pushAttackDirection(PAWN);
      pushPawnBlock(PAWNBLOCK);
    }

    // ================================ horizontal and vertical move ================================ //
    function horizontalVertical() {
      let OP = true;

      // left move
      let L = ["L"];
      let PIN_L = ["L"];
      let protect_L = ["L"];
      for (let i = 0; i <= attackFile + 1; i++) {
        const filePosition = attackFile - i;
        const rankPosition = attackRank;

        pushSquare(PIN_L, filePosition, rankPosition);

        if (
          isSelfPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          i !== 0
        ) {
          L = [...PIN_L];
          break;
        }

        if (
          isOpponentPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          OP
        ) {
          L = [...PIN_L];
          OP = false;
        }

        if (isKing(filePosition, rankPosition)) {
          pushProtectDirection([...PIN_L]);
        }

        if (i === attackFile + 1) OP = true;
      }
      ifEmpty(L, PIN_L);
      pushAttackDirection(L);
      pushPinDirection(PIN_L);

      // right move
      let R = ["R"];
      let PIN_R = ["R"];
      let protect_R = ["R"];
      for (let i = 0; i <= 7 - attackFile + 1; i++) {
        const filePosition = attackFile + i;
        const rankPosition = attackRank;

        pushSquare(PIN_R, filePosition, rankPosition);

        if (
          isSelfPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          i !== 0
        ) {
          R = [...PIN_R];
          break;
        }

        if (
          isOpponentPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          OP
        ) {
          R = [...PIN_R];
          OP = false;
        }

        if (isKing(filePosition, rankPosition)) {
          pushProtectDirection([...PIN_R]);
        }

        if (i === 7 - attackFile + 1) OP = true;
      }
      ifEmpty(R, PIN_R);
      pushAttackDirection(R);
      pushPinDirection(PIN_R);

      // up move
      let U = ["U"];
      let PIN_U = ["U"];
      let protect_U = ["U"];
      for (let i = 0; i <= attackRank + 1; i++) {
        const filePosition = attackFile;
        const rankPosition = attackRank - i;

        pushSquare(PIN_U, filePosition, rankPosition);

        if (
          isSelfPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          i !== 0
        ) {
          U = [...PIN_U];
          break;
        }

        if (
          isOpponentPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          OP
        ) {
          U = [...PIN_U];
          OP = false;
        }

        if (isKing(filePosition, rankPosition)) {
          pushProtectDirection([...PIN_U]);
        }

        if (i === attackRank + 1) OP = true;
      }
      ifEmpty(U, PIN_U);
      pushAttackDirection(U);
      pushPinDirection(PIN_U);

      // down move
      let D = ["D"];
      let PIN_D = ["D"];
      let protect_D = ["D"];
      for (let i = 0; i <= 7 - attackRank + 1; i++) {
        const filePosition = attackFile;
        const rankPosition = attackRank + i;

        pushSquare(PIN_D, filePosition, rankPosition);

        if (
          isSelfPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          i !== 0
        ) {
          D = [...PIN_D];
          break;
        }

        if (
          isOpponentPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          OP
        ) {
          D = [...PIN_D];
          OP = false;
        }

        if (isKing(filePosition, rankPosition)) {
          pushProtectDirection([...PIN_D]);
        }

        if (i === 7 - attackRank + 1) OP = true;
      }
      ifEmpty(D, PIN_D);
      pushAttackDirection(D);
      pushPinDirection(PIN_D);
    }

    // ========================================== diagonal move ===================================== //
    function diagonal() {
      let OP = true;

      // up left diagonal
      let DUL = ["DUL"];
      let PIN_DUL = ["DUL"];
      let prtect_DUL = ["DUL"];
      for (let i = 0; i <= attackFile + 1; i++) {
        const filePosition = attackFile - i;
        const rankPosition = attackRank - i;

        pushSquare(PIN_DUL, filePosition, rankPosition);

        if (
          isSelfPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          i !== 0
        ) {
          DUL = [...PIN_DUL];
          break;
        }

        if (
          isOpponentPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          OP
        ) {
          DUL = [...PIN_DUL];
          OP = false;
        }

        if (isKing(filePosition, rankPosition)) {
          pushProtectDirection([...PIN_DUL]);
        }

        if (i === attackFile + 1) OP = true;
      }
      ifEmpty(DUL, PIN_DUL);
      pushAttackDirection(DUL);
      pushPinDirection(PIN_DUL);

      // up right diagonal

      let DUR = ["DUR"];
      let PIN_DUR = ["DUR"];
      let protect_DUR = ["DUR"];
      for (let i = 0; i <= 7 - attackFile + 1; i++) {
        const filePosition = attackFile + i;
        const rankPosition = attackRank - i;

        pushSquare(PIN_DUR, filePosition, rankPosition);

        if (
          isSelfPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          i !== 0
        ) {
          DUR = [...PIN_DUR];
          break;
        }

        if (
          isOpponentPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          OP
        ) {
          DUR = [...PIN_DUR];
          OP = false;
        }

        if (isKing(filePosition, rankPosition)) {
          pushProtectDirection([...PIN_DUR]);
        }

        if (i === 7 - attackFile + 1) OP = true;
      }
      ifEmpty(DUR, PIN_DUR);
      pushAttackDirection(DUR);
      pushPinDirection(PIN_DUR);

      let DDL = ["DDL"];
      let PIN_DDL = ["DDL"];
      let protect_DDL = [];
      // down left diagonal
      for (let i = 0; i <= attackFile + 1; i++) {
        const filePosition = attackFile - i;
        const rankPosition = attackRank + i;

        pushSquare(PIN_DDL, filePosition, rankPosition);

        if (
          isSelfPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          i !== 0
        ) {
          DDL = [...PIN_DDL];
          break;
        }

        if (
          isOpponentPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          OP
        ) {
          DDL = [...PIN_DDL];
          OP = false;
        }

        if (isKing(filePosition, rankPosition)) {
          pushProtectDirection([...PIN_DDL]);
        }

        if (i === attackFile + 1) {
          OP = true;
        }
      }
      ifEmpty(DDL, PIN_DDL);
      pushAttackDirection(DDL);
      pushPinDirection(PIN_DDL);

      let DDR = ["DDR"];
      let PIN_DDR = ["DDR"];
      let protect_DDR = ["DDR"];
      // down right diagonal
      for (let i = 0; i <= 7 - attackFile + 1; i++) {
        const filePosition = attackFile + i;
        const rankPosition = attackRank + i;

        pushSquare(PIN_DDR, filePosition, rankPosition);

        if (
          isSelfPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          i !== 0
        ) {
          DDR = [...PIN_DDR];
          break;
        }

        if (
          isOpponentPiece(
            overlapBlack,
            overlapWhite,
            filePosition,
            rankPosition,
            turn,
          ) &&
          OP
        ) {
          DDR = [...PIN_DDR];
          OP = false;
        }

        if (isKing(filePosition, rankPosition)) {
          pushProtectDirection([...PIN_DDR]);
        }

        if (i === 7 - attackFile + 1) OP = true;
      }
      ifEmpty(DDR, PIN_DDR);
      pushAttackDirection(DDR);
      pushPinDirection(PIN_DDR);
    }
  }

  //console.log("bas: ", blackAttackSquare);
  //console.log("was: ", whiteAttackSquare);
  //console.log(overlapBlack, overlapWhite);
  // console.log("wp: ", whitePinDirection);
  // console.log("bp: ", blackPinDirection);
  //console.log("kingEscape: ", blackKingEscape, whiteKingEscape.flat());
  //console.log("protect: ", blackProtectDirection, whiteProtectDirection);
  //console.log("pawnBlock: ", blackPawnBlock.flat(), whitePawnBlock.flat());

  return {
    attackDirection: {
      black: blackAttackSquare,
      white: whiteAttackSquare,
    },
    pinDirection: {
      black: blackPinDirection,
      white: whitePinDirection,
    },
    kingDirection: {
      black: blackKingAtkDirec,
      white: whiteKingAtkDirec,
    },
    kingEscape: {
      black: blackKingEscape,
      white: whiteKingEscape,
    },
    pawnBlock: {
      black: blackPawnBlock,
      white: whitePawnBlock,
    },
    protectDirection: {
      black: blackProtectDirection,
      white: whiteProtectDirection,
    },
  };
}