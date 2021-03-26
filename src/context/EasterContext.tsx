import React from "react";
import Loading from "../components/Loading";

interface IEasterContext {
  currentPosition: object;
  step: number;
  nextTask: () => void;
}
export const EasterContext = React.createContext<IEasterContext>({
  currentPosition: {},
  step: 1,
  nextTask: () => {},
});

const EasterContextProvider: React.FC = ({ children }) => {
  const [currentPosition, setCurrentPosition] = React.useState({});
  const [step, setStep] = React.useState<number>(1);

  const nextTask = () => {
    // localStorage.setItem("step", taskNumber);
    setStep(step + 1);
  };

  const success = (position: any) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  React.useEffect(() => {
    // if (!step) setStep(localStorage.getItem("step") || "0");
    // const interval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(success);
    // }, 1000);
    // return () => clearInterval(interval);
  }, []);

  if (!currentPosition || !step) return <Loading />;
  return (
    <EasterContext.Provider
      value={{
        currentPosition,
        step,
        nextTask,
      }}
    >
      {children}
    </EasterContext.Provider>
  );
};

export default EasterContextProvider;
