// src/components/Game.js
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css'; 

function Game() {
  const [gold, setGold] = useState(() => {
    const savedGold = localStorage.getItem('points');
    return savedGold !== null ? Number(savedGold) : 0;
  });

  const [goldPerSecond, setGoldPerSecond] = useState(() => {
    const savedPointsPerSecond = localStorage.getItem('pointsPerSecond');
    return savedPointsPerSecond !== null ? Number(savedPointsPerSecond) : 0;
  });

  const pointsPerSecondRef = useRef(goldPerSecond);

  useEffect(() => {
    pointsPerSecondRef.current = goldPerSecond;
  }, [goldPerSecond]);

  useEffect(() => {
    const lastTimestamp = localStorage.getItem('lastTimestamp');
    const currentTime = Date.now();
    
    if (lastTimestamp) {
      const secondsElapsed = (currentTime - Number(lastTimestamp)) / 1000;
      setGold(prevPoints => prevPoints + pointsPerSecondRef.current * secondsElapsed);
    }

    localStorage.setItem('lastTimestamp', currentTime.toString());
    
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('lastTimestamp', Date.now().toString());
    });

    return () => {
      localStorage.setItem('lastTimestamp', Date.now().toString());
      window.removeEventListener('beforeunload', () => {});
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('points', gold);
    localStorage.setItem('pointsPerSecond', goldPerSecond);
  }, [gold, goldPerSecond]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGold(prevPoints => prevPoints + pointsPerSecondRef.current);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleForgeClick = () => {
    setGold(prevPoints => prevPoints + 1);

    // setGold(0);
    // setGoldPerSecond(0);
  };

  const handleUpgradeClick = () => {
    if (gold >= 10) {
      setGold(prevPoints => prevPoints - 10);
      setGoldPerSecond(prevPointsPerSecond => prevPointsPerSecond + 1);
    }
  };

  return (
    <div className={`${styles.game}`}>
      <div className={styles.lava}></div>
      <div className={styles.gameUi}>
        <h1>Blacksmith Idle</h1>
        <p><b>Gold: {gold}</b></p>
        <p><b>Gold Per Second: {goldPerSecond}</b></p>
        <button onClick={handleForgeClick}>Forge</button>
        <div></div>
        <button onClick={handleUpgradeClick} disabled={gold < 10}>Upgrade Hammer (10 points)</button>
      </div>
    </div>
  );
  
}

export default Game;
