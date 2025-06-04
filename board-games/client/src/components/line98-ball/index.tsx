import { cn } from "@/lib/utils";

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
}: {
  color: BallColor;
  size: BallSize;
  position: BallPosition;
  startPos: BallPosition;
  setStartPos: React.Dispatch<React.SetStateAction<BallPosition>>;
  setEndPos: React.Dispatch<React.SetStateAction<BallPosition>>;
}) => {
  const handleClickBall = () => {
    if (size === "big") {
      setStartPos({ x: position.x, y: position.y });
    } else if (startPos.x !== -1 && startPos.y !== -1) {
      setEndPos({ x: position.x, y: position.y });
    }
  };
  return (
    <div
      onClick={() => handleClickBall()}
      className="w-full h-full border p-2 flex items-center justify-center cursor-pointer"
    >
      {size !== "none" && (
        <div
          className={cn("rounded-full bg-gradient-to-br transition-all", {
            "from-rose-800 to-rose-300": color === "RED",
            "from-blue-800 to-blue-300": color === "BLUE",
            "from-green-800 to-green-300": color === "GREEN",
            "from-purple-800 to-purple-300": color === "PURPLE",
            "from-yellow-800 to-yellow-300": color === "YELLOW",
            "w-full h-full": size === "big",
            "w-1/3 h-1/3": size === "small",
            "animate-bounce":
              size === "big" &&
              position.x === startPos.x &&
              position.y === startPos.y,
          })}
        ></div>
      )}
    </div>
  );
};
