import React from "react";
import Loading from "./Loading";
import { timeDifference } from "./Utils";
import { Alert } from "antd";

interface ICountdown {
  readyCallback: (state: boolean) => void;
  time: Date;
}
const Countdown: React.FC<ICountdown> = ({ readyCallback, time }) => {
  const [timeLeft, setTimeLeft] = React.useState<any>();

  const calculateTimeLeft = () => {
    const difference = timeDifference(time);
    if (difference <= 0) readyCallback(true);
    return {
      dager: Math.floor(difference / (1000 * 60 * 60 * 24)),
      timer: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutter: Math.floor((difference / 1000 / 60) % 60),
      sekunder: Math.floor((difference / 1000) % 60),
    };
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft);
    }, 1000);
    return () => clearInterval(interval);
  });

  if (!timeLeft) return <Loading />;

  return (
    <Alert
      message={"Er du klar for den store påskejakten?"}
      description={
        <div>
          <strong>Nedtelling</strong>
          <ul>
            {timeLeft &&
              Object.keys(timeLeft).map((key) => (
                <li key={key}>
                  {timeLeft[key]} {key}
                </li>
              ))}
          </ul>
        </div>
      }
      type="info"
      showIcon
    />
  );
};

export default Countdown;
