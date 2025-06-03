import { cn } from "@/lib/utils";
import { socket } from "@/socket";
import useUserStore from "@/stores/user-store";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

type TCellValue = "X" | "O" | "_";

type LiveGame = {
  id: number;
  x_player: string;
  o_player: string;
  current_turn: "X" | "O";
  room: string;
  board: TCellValue[][];
};

type TCellPosition = { x: number; y: number };

const CaroCell = ({
  value,
  position,
  room,
  gameId,
  isMyTurn,
}: {
  value: TCellValue;
  position: TCellPosition;
  room: string;
  gameId: number;
  isMyTurn: boolean;
}) => {
  const handleClick = () => {
    if (gameId === -1) {
      toast.warning("The game has not started yet");
      return;
    }
    if (!isMyTurn) {
      toast.warning("Not your turn");
      return;
    }
    socket.emit("game-move", {
      room,
      position,
      gameId,
    });
  };
  return (
    <div
      className="w-full h-full flex justify-center items-center border text-lg outline-none cursor-pointer"
      onClick={handleClick}
    >
      {value === "_" ? "" : value}
    </div>
  );
};

const CaroBoard = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [currentTurn, setCurrenTurn] = useState<TCellValue>("_");
  const [playAs, setPlayAs] = useState<TCellValue>("_");
  const [roomName, setRoomName] = useState<string>("");
  const [message, setMessage] = useState<string[]>([]);
  const [gameId, setGameId] = useState<number>(-1);
  const [board, setBoard] = useState<TCellValue[][]>(
    new Array(12).fill(new Array(12).fill("_")).map((row) => [...row]),
  );
  const user = useUserStore.use.user();
  useEffect(() => {
    if (isConnected) {
      return;
    }

    const onConnect = () => {
      console.log("Connected, socket id:", socket.id);
      setMessage((pre) => [...pre, "You are connected"]);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("Disconnected");
      setMessage((pre) => [...pre, "You are disconnected"]);
      setIsConnected(false);
      setBoard(
        new Array(12).fill(new Array(12).fill("_")).map((row) => [...row]),
      );
    };

    const onMessage = (data: { message: string }) => {
      console.log(data);
      setMessage((pre) => [...pre, data.message]);
    };

    const onLiveGame = (data: LiveGame) => {
      if (socket.id === data.x_player) {
        setPlayAs("X");
      } else {
        setPlayAs("O");
      }
      setGameId(data.id);
      setCurrenTurn(data.current_turn);
      setBoard(data.board);
      console.log(data);
    };

    const onGameEnd = (data: { winner: TCellValue }) => {
      socket.emit("leave-room", {
        room: roomName,
        nickname: user?.nickname || "someone",
      });
      setMessage((pre) => [...pre, `${data.winner} is Winner`]);
      setPlayAs("_");
      setCurrenTurn("_");
      setRoomName("");
      setGameId(-1);
      setBoard(
        new Array(12).fill(new Array(12).fill("_")).map((row) => [...row]),
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    socket.on("live-game", onLiveGame);
    socket.on("game-end", onGameEnd);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.off("live-game", onLiveGame);
      socket.off("game-end", onGameEnd);
    };
  }, []);

  const handleJoinRoom = () => {
    if (!roomName) {
      toast.warning("Enter room name");
      return;
    }
    socket.emit("join-room", {
      room: roomName,
      nickname: user?.nickname || "someone",
    });
    setBoard(
      new Array(12).fill(new Array(12).fill("_")).map((row) => [...row]),
    );
  };
  const handleLeaveRoom = () => {
    socket.emit("leave-room", {
      room: roomName,
      nickname: user?.nickname || "someone",
    });
    setGameId(-1);
  };

  return (
    <div className="flex gap-x-3">
      <div className="grid grid-cols-12 grid-rows-12 gap-1 w-[32rem] h-[32rem]">
        {board.map((row, x) => (
          <Fragment key={`row-${x}`}>
            {row.map((_, y) => (
              <Fragment key={`cell-${x}${y}`}>
                <CaroCell
                  position={{ x, y }}
                  value={board[x][y]}
                  isMyTurn={playAs === currentTurn}
                  gameId={gameId}
                  room={roomName}
                />
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
      <div className="flex flex-col grow gap-3">
        <div className="flex flex-col">
          <h3>State: {isConnected ? "connected" : "disconnected"}</h3>
          <h3>Game started: {gameId !== -1 ? "true" : "false"}</h3>
          <h3>
            You play as: <span className="font-bold">{playAs}</span>
          </h3>
          <h3>
            Current turn: <span className="font-bold">{currentTurn}</span>
          </h3>
        </div>
        <div className="flex flex-col h-[20rem] border overflow-y-auto px-2">
          <h3 className="font-semibold text-lg w-full border-b text-center">
            Message
          </h3>
          {message.map((ms, idx) => (
            <p key={`ms-${idx}`}>{ms}</p>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <input
            className={cn("h-10 w-full border px-3", {
              "cursor-not-allowed": gameId !== -1,
            })}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="enter room name ..."
            disabled={gameId !== -1}
          ></input>
          <div className="flex gap-1">
            <button
              className={cn("border p-1 bg-secondary cursor-pointer", {
                "cursor-not-allowed": gameId !== -1,
              })}
              onClick={handleJoinRoom}
              disabled={gameId !== -1}
            >
              Enter room
            </button>
            <button
              className={cn("border p-1 bg-secondary cursor-pointer", {
                "cursor-not-allowed": gameId !== -1,
              })}
              onClick={handleLeaveRoom}
              disabled={gameId !== -1}
            >
              Leave room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaroBoard;
