import { useEffect, useState } from "react";

export const useCountdown = (targetDate: number) => {
  const countDownDate = new Date(targetDate).getTime();

  const [timer, setTimer] = useState<NodeJS.Timer>();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    setTimer(interval);

    return () => clearInterval(interval);
  }, [countDownDate]);

  useEffect(() => {
    if (countDown <= 1000) {
      clearInterval(timer);
    }
  }, [countDown]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

export const getSeconds = (seconds: number) =>
  new Date().getTime() + seconds * 1000 + 1000;
