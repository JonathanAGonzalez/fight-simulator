import { useEffect, useState } from 'react';
import './App.css';

const Card = ({ count, srcImage }: { count: number; srcImage: string }) => {
  return (
    <div className='container__card '>
      <img src={srcImage} alt='' />
      <div>
        <h3>Habilities</h3>
        <progress id='file' max='100' value={count}>
          {' '}
          70%{' '}
        </progress>
        <ul>
          <li>Ataque</li>
          <li>Defensa</li>
          <li>Vitalidad</li>
          <li>Agilidad</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  const [players, setPlayers] = useState([
    { name: 'Player 1', life: 100, srcImage: '/images/1.png' },
    { name: 'Player 2', life: 100, srcImage: '/images/2.png' },
  ]);
  const [turn, setTurn] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute

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

  console.log(timeLeft);

  return (
    <>
      <h2>Healt Player 1: {players[0].life}</h2>
      <h2>Healt Player 2: {players[1].life}</h2>
      <h2>Time: {timeLeft}</h2>
      {winner}

      <div className='container__cards'>
        <Card count={players[0].life} srcImage={players[0].srcImage} />
        {isStarted ? (
          <button onClick={handleAttack}>Attack</button>
        ) : (
          <button onClick={handleStart}>Fight!</button>
        )}
        <Card count={players[1].life} srcImage={players[0].srcImage} />
      </div>
    </>
  );
}

export default App;
