import { checkMove, getHint, newBoard, processBoard } from "@/lib/line98";
import { Fragment, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type TBall98 = {
  color: BallColor;
  size: BallSize;
};

export type BallColor = "RED" | "GREEN" | "BLUE" | "PURPLE" | "YELLOW";

export type BallSize = "none" | "small" | "big";

export type BallPosition = { x: number; y: number };

export const Ball98 = ({
  color,
  size,
  position,
  startPos,
  setStartPos,
  setEndPos,
  hintPos,
  setHintPos,
}: {
  color: BallColor;
  size: BallSize;
  position: BallPosition;
  startPos: BallPosition;
  setStartPos: React.Dispatch<React.SetStateAction<BallPosition>>;
  setEndPos: React.Dispatch<React.SetStateAction<BallPosition>>;
  hintPos: [BallPosition, BallPosition];
  setHintPos: React.Dispatch<
    React.SetStateAction<[BallPosition, BallPosition]>
  >;
}) => {
  const handleClickBall = () => {
    if (size === "big") {
      setStartPos({ x: position.x, y: position.y });
    } else if (startPos.x !== -1 && startPos.y !== -1) {
      setEndPos({ x: position.x, y: position.y });
      if (hintPos[0].x !== -1 && hintPos[0].y !== -1) {
        setHintPos([
          { x: -1, y: -1 },
          { x: -1, y: -1 },
        ]);
      }
    }
  };
  return (
    <div
      onClick={() => handleClickBall()}
      className="relative w-full h-full border p-2 flex items-center justify-center cursor-pointer"
    >
      {((hintPos[0].x === position.x && hintPos[0].y === position.y) ||
        (hintPos[1].x === position.x && hintPos[1].y === position.y)) && (
        <div className="absolute h-full w-full p-6">
          <div className="w-full h-full bg-red-600 rounded-full animate-ping"></div>
        </div>
      )}
      <div
        className={cn(
          "rounded-full bg-gradient-to-br transition-all duration-200",
          {
            "from-rose-800 to-rose-300": color === "RED",
            "from-blue-800 to-blue-300": color === "BLUE",
            "from-green-800 to-green-300": color === "GREEN",
            "from-purple-800 to-purple-300": color === "PURPLE",
            "from-yellow-800 to-yellow-300": color === "YELLOW",
            "w-full h-full": size === "big",
            "w-1/3 h-1/3": size === "small",
            "w-0 h-0": size === "none",
            "animate-bounce":
              size === "big" &&
              position.x === startPos.x &&
              position.y === startPos.y,
          },
        )}
      ></div>
    </div>
  );
};

const Line98 = () => {
  const [startPos, setStartPos] = useState<BallPosition>({ x: -1, y: -1 });
  const [endPos, setEndPos] = useState<BallPosition>({ x: -1, y: -1 });
  const [board, setBoard] = useState<TBall98[][]>(newBoard());
  const [hintPos, setHintPos] = useState<[BallPosition, BallPosition]>([
    { x: -1, y: -1 },
    { x: -1, y: -1 },
  ]);

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

  const showHint = () => {
    const hint = getHint(board);
    if (hint[0].x === -1 && hint[0].y === -1) {
      toast.error("There is no more good moves");
      return;
    }
    setHintPos(hint);
  };

  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <div className="w-[36rem] p-2 flex justify-between">
        <h1 className="text-2xl font-bold">Line 98</h1>
        <button
          onClick={showHint}
          className="text-xl font-bold underline cursor-pointer"
        >
          Hint?
        </button>
      </div>
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
                hintPos={hintPos}
                setHintPos={setHintPos}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Line98;
