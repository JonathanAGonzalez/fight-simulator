import { useEffect, useRef, useState } from 'react';
import './App.css';

const Card = ({ count, srcImage }: { count: number; srcImage: string }) => {
  const reference: any = useRef(null);
  const audio = document.getElementById('punch') as HTMLAudioElement;
  const audio2 = document.getElementById('punch2') as HTMLAudioElement;

  const animationAttack = () => {
    if (!reference.current) return;
    if (!audio || !audio2) return;
    audio?.play();
    audio.volume = 0.2;

    reference.current.classList.add('animation__attack');
    setTimeout(() => {
      reference.current.classList.remove('animation__attack');
      audio2?.play();
      audio2.volume = 0.2;
    }, 500);
  };

  useEffect(() => {
    animationAttack();
  }, [count]);

  return (
    <div className='container__card' ref={reference}>
      <img src={srcImage} alt='' />
      <div>
        <h3>Habilities</h3>
        <progress id='file' max='100' value={count}></progress>
        <ul>
          <li>Ataque - 5</li>
          <li>Defensa - 5</li>
          <li>Vitalidad - 5</li>
          <li>Agilidad - 5</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  const [players, setPlayers] = useState([
    { name: 'Player 1', life: 100, srcImage: '/images/1.png', im: true },
    { name: 'Player 2', life: 100, srcImage: '/images/2.png' },
  ]);
  const [turn, setTurn] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  const handleAttack = () => {
    if (isGameOver) return;

    const damage = Math.floor(Math.random() * 60) + 1;
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayer].life -= damage;
    setPlayers(updatedPlayers);
    setTurn(turn + 1);
  };

  const handleSwitchPlayer = () => {
    const nextPlayer = currentPlayer === 0 ? 1 : 0;
    setCurrentPlayer(nextPlayer);
  };

  const checkGameOver = () => {
    if (players[0].life <= 0 || players[1].life <= 0 || timeLeft <= 0) {
      setIsGameOver(true);

      const winner =
        players[0].life > players[1].life ? players[0].name : players[1].name;
      setWinner(winner || '');
    }
  };

  useEffect(() => {
    if (isStarted && !isGameOver) {
      checkGameOver();
      handleSwitchPlayer();
    }
  }, [turn]);

  useEffect(() => {
    if (isStarted && !isGameOver) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000); // 1000 milliseconds = 1 second

      return () => clearInterval(interval);
    }
  }, [isStarted, isGameOver, timeLeft]);

  useEffect(() => {
    let attackInterval: any = null;

    if (isStarted && !isGameOver) {
      attackInterval = setInterval(() => {
        handleAttack();
        checkGameOver();
      }, 800);
    }

    return () => clearInterval(attackInterval);
  }, [isStarted, isGameOver, currentPlayer]);

  const handleStart = () => {
    setIsStarted(true);
  };

  return (
    <>
      <h2>Time: {timeLeft}</h2>
      {winner}
      <audio id='punch' src='/sound/punch.mp3'></audio>
      <audio id='punch2' src='/sound/punch.mp3'></audio>
      <audio id='game-over' src='/sound/game-over.mp3'></audio>
      <audio id='winner' src='/sound/winner.mp3'></audio>
      <div className='container__cards'>
        <Card count={players[0].life} srcImage={players[0].srcImage} />
        {!isStarted && <button onClick={handleStart}>Fight!</button>}
        <Card count={players[1].life} srcImage={players[1].srcImage} />
      </div>
    </>
  );
}

export default App;
