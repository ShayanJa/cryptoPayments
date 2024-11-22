import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expiryTime: Date;
  onExpire: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
  }>({ minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = expiryTime.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        onExpire();
        return { minutes: 0, seconds: 0 };
      }

      return {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime, onExpire]);

  const formatNumber = (num: number): string => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg text-sm">
      <Clock className="w-4 h-4" />
      <span>
        Address expires in{' '}
        <span className="font-mono font-medium">
          {formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </span>
      </span>
    </div>
  );
};