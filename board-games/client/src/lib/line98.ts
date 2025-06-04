import type { BallColor, BallPosition } from "@/components/line98-ball";
import type { TBall98 } from "@/pages/games/line98";

export const colors: BallColor[] = ["RED", "GREEN", "BLUE", "PURPLE", "YELLOW"];

export function threeRandomColor(): BallColor[] {
  const result: BallColor[] = [];
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * 5);
    result.push(colors[idx]);
  }
  return result;
}

export function getEmptyPositions(board: TBall98[][]): BallPosition[] {
  let emptyPositions: BallPosition[] = [];

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (board[x][y].size === "none") {
        emptyPositions.push({ x, y });
      }
    }
  }

  return emptyPositions;
}

export function threeRandomEmptyPositions(
  emptyPositions: BallPosition[],
): BallPosition[] {
  if (emptyPositions.length <= 3) {
    return emptyPositions;
  }
  const result: BallPosition[] = [];
  const visitedIdx = new Array<boolean>(emptyPositions.length);
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * emptyPositions.length);
    while (visitedIdx[idx]) {
      idx = Math.floor(Math.random() * emptyPositions.length);
    }
    result.push(emptyPositions[idx]);
    visitedIdx[idx] = true;
  }

  return result;
}

export function exploreLines(
  board: TBall98[][],
  ...positions: BallPosition[]
): TBall98[][] {
  const result: TBall98[][] = [];
  for (let i = 0; i < 9; i++) {
    let row = board[i];
    result.push([...row]);
  }

  for (let pos of positions) {
    let x = pos.x,
      y = pos.y;

    // check row
    let l = y,
      r = y;
    while (l - 1 >= 0) {
      if (
        board[x][l - 1].size === "big" &&
        board[x][l - 1].color === board[x][l].color
      ) {
        l--;
      } else {
        break;
      }
    }
    while (r + 1 < 9) {
      if (
        board[x][r + 1].size === "big" &&
        board[x][r + 1].color === board[x][r].color
      ) {
        r++;
      } else {
        break;
      }
    }

    // if has a ball chain of same color with length >= 5 on line x, delete all those balls
    if (r - l + 1 >= 5) {
      for (let j = l; j <= r; j++) {
        result[x][j].size = "none";
      }
    }

    // check colum
    let u = x,
      d = x;
    while (u - 1 >= 0) {
      if (
        board[u - 1][y].size === "big" &&
        board[u - 1][y].color === board[u][y].color
      ) {
        u--;
      } else {
        break;
      }
    }
    while (d + 1 < 9) {
      if (
        board[d + 1][y].size === "big" &&
        board[d + 1][y].color === board[d][y].color
      ) {
        d++;
      } else {
        break;
      }
    }
    // if has a ball chain of same color with length >= 5 on column y, delete all those balls
    if (d - u + 1 >= 5) {
      for (let i = u; i <= d; i++) {
        result[i][y].size = "none";
      }
    }

    // check diagonal 1
    let du1 = x, // diagonal-up pointer
      dd1 = x, // diagonal-down pointer
      dl1 = y, // diagonal-left pointer
      dr1 = y, // diagonal-right pointer
      di1 = 1;
    while (du1 - 1 >= 0 && dl1 - 1 >= 0) {
      if (
        board[du1 - 1][dl1 - 1].size === "big" &&
        board[du1 - 1][dl1 - 1].color === board[du1][dl1].color
      ) {
        du1--;
        dl1--;
        di1++;
      } else {
        break;
      }
    }
    while (dd1 + 1 < 9 && dr1 + 1 < 9) {
      if (
        board[dd1 + 1][dr1 + 1].size === "big" &&
        board[dd1 + 1][dr1 + 1].color === board[dd1][dr1].color
      ) {
        dd1++;
        dr1++;
        di1++;
      } else {
        break;
      }
    }
    // if has a ball chain of same color with length >= 5 on diagonal 1, delete all those balls
    if (di1 >= 5) {
      for (let i = du1, j = dl1; i <= dd1 && j <= dr1; i++, j++) {
        result[i][j].size = "none";
      }
    }

    // check diagnal 2
    let du2 = x, // diagonal-up pointer
      dd2 = x, // diagonal-down pointer
      dl2 = y, // diagonal-left pointer
      dr2 = y, // diagonal-right pointer
      di2 = 1;
    while (du2 - 1 >= 0 && dr2 + 1 < 9) {
      if (
        board[du2 - 1][dr2 + 1].size === "big" &&
        board[du2 - 1][dr2 + 1].color === board[du2][dr2].color
      ) {
        du2--;
        dr2++;
        di2++;
      } else {
        break;
      }
    }
    while (dd2 + 1 < 9 && dl2 - 1 >= 0) {
      if (
        board[dd2 + 1][dl2 - 1].size === "big" &&
        board[dd2 + 1][dl2 - 1].color === board[dd2][dl2].color
      ) {
        dd2++;
        dl2--;
        di2++;
      } else {
        break;
      }
    }
    // if has a ball chain of same color with length >= 5 on diagonal 1, delete all those balls
    if (di2 >= 5) {
      for (let i = du2, j = dr2; i <= dd2 && j >= dl2; i++, j--) {
        result[i][j].size = "none";
      }
    }
  }

  return result;
}

export function newBoard(): TBall98[][] {
  const board: TBall98[][] = [];
  for (let i = 0; i < 9; i++) {
    let row: TBall98[] = [];
    for (let j = 0; j < 9; j++) {
      row.push({ size: "none", color: "RED" });
    }
    board.push(row);
  }
  const colors: BallColor[] = ["RED", "GREEN", "BLUE", "PURPLE", "YELLOW"];

  // new 10 balls, 7 big balls, 3 small balls

  // 7 random colors for big balls
  const bigBallColor: BallColor[] = [];
  for (let i = 0; i < 7; i++) {
    let idx = Math.floor(Math.random() * 5);
    bigBallColor.push(colors[idx]);
  }
  // 3 random colors for small balls
  const smallBallColor: BallColor[] = [];
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * 5);
    smallBallColor.push(colors[idx]);
  }

  const visitedPos = new Array<boolean>(81).fill(false);
  for (let i = 0; i < 7; i++) {
    let idx = Math.floor(Math.random() * 81);
    while (visitedPos[idx]) {
      idx = Math.floor(Math.random() * 81);
    }
    visitedPos[idx] = true;
    let x = Math.floor(idx / 9),
      y = idx % 9;
    board[x][y].color = bigBallColor[i];
    board[x][y].size = "big";
  }
  for (let i = 0; i < 3; i++) {
    let idx = Math.floor(Math.random() * 81);
    while (visitedPos[idx]) {
      idx = Math.floor(Math.random() * 81);
    }
    visitedPos[idx] = true;
    let x = Math.floor(idx / 9),
      y = idx % 9;
    board[x][y].color = smallBallColor[i];
    board[x][y].size = "small";
  }

  return board;
}

export function checkMove(
  board: TBall98[][],
  startPos: BallPosition,
  endPos: BallPosition,
): boolean {
  const visited: boolean[][] = [];
  for (let i = 0; i < 9; i++) {
    visited.push(new Array<boolean>(9).fill(false));
  }
  visited[startPos.x][startPos.y] = true;
  let queue: BallPosition[] = [startPos];
  while (queue.length > 0) {
    let newQueue: BallPosition[] = [];
    for (let pos of queue) {
      let x = pos.x,
        y = pos.y;
      if (x - 1 >= 0 && board[x - 1][y].size !== "big" && !visited[x - 1][y]) {
        visited[x - 1][y] = true;
        newQueue.push({ x: x - 1, y });
      }
      if (x + 1 < 9 && board[x + 1][y].size !== "big" && !visited[x + 1][y]) {
        visited[x + 1][y] = true;
        newQueue.push({ x: x + 1, y });
      }
      if (y - 1 >= 0 && board[x][y - 1].size !== "big" && !visited[x][y - 1]) {
        visited[x][y - 1] = true;
        newQueue.push({ x, y: y - 1 });
      }
      if (y + 1 < 9 && board[x][y + 1].size !== "big" && !visited[x][y + 1]) {
        visited[x][y + 1] = true;
        newQueue.push({ x, y: y + 1 });
      }
    }
    queue = newQueue;
  }
  return visited[endPos.x][endPos.y];
}

export function getSmallBallPos(board: TBall98[][]): BallPosition[] {
  const result: BallPosition[] = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].size === "small") {
        result.push({ x: i, y: j });
      }
    }
  }
  return result;
}

export function processBoard(
  board: TBall98[][],
  startPos: BallPosition,
  endPos: BallPosition,
): TBall98[][] {
  board[endPos.x][endPos.y].size = "big";
  board[endPos.x][endPos.y].color = board[startPos.x][startPos.y].color;
  board[startPos.x][startPos.y].size = "none";

  const emptyPos = getEmptyPositions(board);
  const smallBallPos = getSmallBallPos(board);
  if (smallBallPos.length === 2) {
    // if end position is a small ball
    let idx = Math.floor(Math.random() * emptyPos.length);
    let x = emptyPos[idx].x,
      y = emptyPos[idx].y;
    emptyPos.splice(idx, 1);
    board[x][y].size = "big";
    board[x][y].color = colors[Math.floor(Math.random() * colors.length)];
  }
  for (let pos of smallBallPos) {
    board[pos.x][pos.y].size = "big";
  }
  const threeNewPos = threeRandomEmptyPositions(emptyPos);
  const threeNewColor = threeRandomColor();
  for (let i in threeNewPos) {
    let pos = threeNewPos[i];
    board[pos.x][pos.y].color = threeNewColor[i];
    board[pos.x][pos.y].size = "small";
  }

  const result = exploreLines(board, endPos, ...smallBallPos);

  return result;
}
