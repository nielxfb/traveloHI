import { useEffect, useRef, useState } from "react";
import BackgroundImage from "./../game_asset/background/background.png";
import LifeBar from "./../game_asset/lifebar full.png";
import BackgroundMusic from "./../game_asset/background music 1.mp3";
import { BlastImpulse } from "../game/player/blast-impulse";
import NavbarLayout from "../layouts/navbar-layout";
import { Timer } from "../game/utils/timer";
import { SwordImpulse } from "../game/player/sword-impulse";
import { io } from "socket.io-client";
import Button from "../components/button";
import CenterizedContent from "../layouts/centerized-content";
import { useJwt } from "../hooks/use-jwt";

function MultiplayerGame() {
  const { sub } = useJwt();
  let blastImpulse: BlastImpulse | null = null;
  let swordImpulse: SwordImpulse | null = null;
  let timer: Timer | null = null;
  let backgroundMusic: HTMLAudioElement | null = null;
  let gameOver = false;
  let gameCondition = "";

  const socket = io("http://localhost:5174");
  const [playerNumber, setPlayerNumber] = useState<number | null>(null);
  const [playerAssigned, setPlayerAssigned] = useState<boolean>(false);
  const [gameInitialized, setGameInitialized] = useState<boolean>(false);

  const width = window.innerWidth;
  const height = window.innerHeight;
  let holdingS = false;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sendMessage = (name: string, object: SwordImpulse | BlastImpulse) => {
    socket.emit("send_message", {
      name: name,
      object: object,
    });
  };

  const sendInformation = () => {
    socket.emit("connected", {});
  };

  const blastImpulseKeyDownHandler = (e: KeyboardEvent) => {
    if (!blastImpulse) {
      return;
    }

    const isJumping =
      blastImpulse!.currState == blastImpulse!.jumpState ||
      blastImpulse!.currState == blastImpulse!.jumpWalkingState ||
      blastImpulse!.currState == blastImpulse!.jumpBackwardState ||
      blastImpulse!.y < window.innerHeight - 350;

    if (e.key == "s") {
      holdingS = true;
    }

    if (e.code == "Space") {
      e.preventDefault();
    }

    if (
      (e.key == "w" && blastImpulse!.currState == blastImpulse!.walkingState) ||
      (e.key == "d" && blastImpulse!.currState == blastImpulse!.jumpState) ||
      (e.key == "d" &&
        blastImpulse!.currState == blastImpulse!.jumpWalkingState)
    ) {
      blastImpulse!.currState = blastImpulse!.jumpWalkingState;
    } else if (
      (e.key == "w" &&
        blastImpulse!.currState == blastImpulse!.backwardState) ||
      (e.key == "a" && blastImpulse!.currState == blastImpulse!.jumpState) ||
      (e.key == "a" &&
        blastImpulse!.currState == blastImpulse!.jumpWalkingState)
    ) {
      blastImpulse!.currState = blastImpulse!.jumpBackwardState;
    } else if (
      e.key == "w" &&
      blastImpulse!.currState != blastImpulse!.jumpState
    ) {
      blastImpulse!.currState = blastImpulse!.jumpState;
    } else if (e.key == "a" && !isJumping) {
      blastImpulse!.currState = blastImpulse!.backwardState;
    } else if (e.key == "d" && !isJumping) {
      blastImpulse!.currState = blastImpulse!.walkingState;
    } else if (
      e.code == "Space" &&
      blastImpulse!.currState == blastImpulse!.walkingState &&
      !isJumping
    ) {
      blastImpulse!.currState = blastImpulse!.frontKickState;
    } else if (e.code == "Space" && holdingS && !isJumping) {
      blastImpulse!.currState = blastImpulse!.lowKickState;
    }

    sendMessage("Blast Impulse", blastImpulse!);
  };

  const blastImpulseKeyUpHandler = (e: KeyboardEvent) => {
    const isJumping =
      blastImpulse!.currState == blastImpulse!.jumpState ||
      blastImpulse!.currState == blastImpulse!.jumpWalkingState ||
      blastImpulse!.currState == blastImpulse!.jumpBackwardState ||
      blastImpulse!.y < window.innerHeight - 350;

    if (e.key == "s") {
      holdingS = false;
    }

    if (blastImpulse!.y < window.innerHeight - 350 || isJumping) {
      return;
    }

    if (blastImpulse!.y < window.innerHeight - 350 && !isJumping) {
      blastImpulse!.currState = blastImpulse!.jumpState;
    }

    blastImpulse!.currState = blastImpulse!.idleState;

    sendMessage("Blast Impulse", blastImpulse!);
  };

  const swordImpulseKeyDownHandler = (e: KeyboardEvent) => {
    if (!swordImpulse) {
      return;
    }

    const isJumping =
      swordImpulse!.currState == swordImpulse!.jumpState ||
      swordImpulse!.currState == swordImpulse!.jumpWalkingState ||
      swordImpulse!.currState == swordImpulse!.jumpBackwardState ||
      swordImpulse!.y < window.innerHeight - 350;

    if (e.key == "s") {
      holdingS = true;
    }

    if (e.code == "Space") {
      e.preventDefault();
    }

    if (
      (e.key == "w" && swordImpulse!.currState == swordImpulse!.walkingState) ||
      (e.key == "d" && swordImpulse!.currState == swordImpulse!.jumpState) ||
      (e.key == "d" &&
        swordImpulse!.currState == swordImpulse!.jumpWalkingState)
    ) {
      swordImpulse!.currState = swordImpulse!.jumpWalkingState;
    } else if (
      (e.key == "w" &&
        swordImpulse!.currState == swordImpulse!.backwardState) ||
      (e.key == "a" && swordImpulse!.currState == swordImpulse!.jumpState) ||
      (e.key == "a" &&
        swordImpulse!.currState == swordImpulse!.jumpWalkingState)
    ) {
      swordImpulse!.currState = swordImpulse!.jumpBackwardState;
    } else if (
      e.key == "w" &&
      swordImpulse!.currState != swordImpulse!.jumpState
    ) {
      swordImpulse!.currState = swordImpulse!.jumpState;
    } else if (e.key == "a" && !isJumping) {
      swordImpulse!.currState = swordImpulse!.backwardState;
    } else if (e.key == "d" && !isJumping) {
      swordImpulse!.currState = swordImpulse!.walkingState;
    } else if (
      e.code == "Space" &&
      swordImpulse!.currState == swordImpulse!.walkingState &&
      !isJumping
    ) {
      swordImpulse!.currState = swordImpulse!.frontKickState;
    } else if (e.code == "Space" && holdingS && !isJumping) {
      swordImpulse!.currState = swordImpulse!.lowKickState;
    }

    sendMessage("Sword Impulse", swordImpulse!);
  };

  const swordImpulseKeyUpHandler = (e: KeyboardEvent) => {
    const isJumping =
      swordImpulse!.currState == swordImpulse!.jumpState ||
      swordImpulse!.currState == swordImpulse!.jumpWalkingState ||
      swordImpulse!.currState == swordImpulse!.jumpBackwardState ||
      swordImpulse!.y < window.innerHeight - 350;

    if (e.key == "s") {
      holdingS = false;
    }

    if (swordImpulse!.y < window.innerHeight - 350 || isJumping) {
      return;
    }

    if (swordImpulse!.y < window.innerHeight - 350 && !isJumping) {
      swordImpulse!.currState = swordImpulse!.jumpState;
    }

    swordImpulse!.currState = swordImpulse!.idleState;

    sendMessage("Sword Impulse", swordImpulse!);
  };

  const startGame = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (playerNumber === 1) {
      window.addEventListener("keydown", blastImpulseKeyDownHandler);
      window.addEventListener("keyup", blastImpulseKeyUpHandler);
    } else if (playerNumber === 2) {
      window.addEventListener("keydown", swordImpulseKeyDownHandler);
      window.addEventListener("keyup", swordImpulseKeyUpHandler);
    }

    blastImpulse = new BlastImpulse(context, 100, window.innerHeight - 350);
    swordImpulse = new SwordImpulse(
      context,
      window.innerWidth - 100,
      window.innerHeight - 350
    );
    timer = new Timer(context, 200);

    const backgroundImage = new Image();
    backgroundImage.src = BackgroundImage;

    const lifeBar = new Image();
    lifeBar.src = LifeBar;

    backgroundMusic = new Audio();
    backgroundMusic.src = BackgroundMusic;
    backgroundMusic.play();

    const animate = () => {
      if (!blastImpulse || !swordImpulse) return;
      context.clearRect(0, 0, width, height);
      context.drawImage(backgroundImage, 0, 0, width, height);
      context.drawImage(lifeBar, 50, 10, width - 100, 100);
      blastImpulse.update();
      swordImpulse.update();
      timer!.render();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("keydown", blastImpulseKeyDownHandler);
      window.removeEventListener("keyup", blastImpulseKeyUpHandler);
      window.removeEventListener("keydown", swordImpulseKeyDownHandler);
      window.removeEventListener("keyup", swordImpulseKeyUpHandler);
      backgroundMusic?.pause();
    };
  };

  useEffect(() => {
    socket.on("player_number", (data: number) => {
      setPlayerNumber(data);
      setPlayerAssigned(true);
    });

    socket.on("receive_message", ({ name, object }) => {
      if (!swordImpulse || !blastImpulse) {
        return;
      }

      if (name === "Sword Impulse") {
        swordImpulse.currState = object.currState;
        swordImpulse.x = object.x;
        swordImpulse.y = object.y;
      } else if (name === "Blast Impulse") {
        blastImpulse.currState = object.currState;
        blastImpulse.x = object.x;
        blastImpulse.y = object.y;
      }
    });

    socket.on("start_game", () => {
      timer?.countdown();
    });
  }, [socket, playerAssigned]);

  const initializeGame = () => {
    if (canvasRef.current && !gameInitialized && playerAssigned) {
      startGame(canvasRef.current);
      setGameInitialized(true);
      if (playerNumber === 2) {
        timer?.countdown();
      }
    }
  };

  useEffect(() => {
    initializeGame();
  }, [playerNumber, gameInitialized]);

  return (
    <NavbarLayout>
      {!gameInitialized ? (
        <CenterizedContent>
          <Button onClick={sendInformation}>Start Game</Button>
        </CenterizedContent>
      ) : (
        <></>
      )}
      <canvas id="gameCanvas" width={width} height={height} ref={canvasRef} />
    </NavbarLayout>
  );
}

export default MultiplayerGame;
