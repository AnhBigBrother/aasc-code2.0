import {
  Ball98,
  type BallColor,
  type BallPosition,
  type BallSize,
} from "@/components/line98-ball";
import { checkMove, newBoard, processBoard } from "@/lib/line98";
import { Fragment, useEffect, useState } from "react";

export type TBall98 = {
  color: BallColor;
  size: BallSize;
};

const Line98 = () => {
  const [startPos, setStartPos] = useState<BallPosition>({ x: -1, y: -1 });
  const [endPos, setEndPos] = useState<BallPosition>({ x: -1, y: -1 });
  const [board, setBoard] = useState<TBall98[][]>(newBoard());

  useEffect(() => {
    setStartPos({ x: -1, y: -1 });
    setEndPos({ x: -1, y: -1 });
  }, [board]);

  useEffect(() => {
    if (
      startPos.x !== -1 &&
      startPos.y !== -1 &&
      endPos.x !== -1 &&
      endPos.y !== -1
    ) {
      if (!checkMove(board, startPos, endPos)) {
        setStartPos({ x: -1, y: -1 });
        setEndPos({ x: -1, y: -1 });
        return;
      }
      const result = processBoard(board, startPos, endPos);
      setBoard(result);
    }
  }, [startPos, endPos]);

  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold">Line 98</h1>
      <div className="w-[36rem] border-2 h-[36rem] grid grid-cols-9 grid-rows-9">
        {board.map((row, x) => (
          <Fragment key={`row98-${x}`}>
            {row.map((ball, y) => (
              <Ball98
                key={`cell98-${x}-${y}`}
                size={ball.size}
                startPos={startPos}
                setStartPos={setStartPos}
                setEndPos={setEndPos}
                position={{ x, y }}
                color={ball.color}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Line98;
