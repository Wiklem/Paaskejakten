import React from "react";
import Loading from "./Loading";

interface IEasterContext {
  currentPosition: object;
  step?: string;
  nextTask: (type: string) => void;
}
export const EasterContext = React.createContext<IEasterContext>({
  currentPosition: {},
  step: undefined,
  nextTask: () => {},
});

const EasterContextProvider: React.FC = ({ children }) => {
  const [currentPosition, setCurrentPosition] = React.useState({});
  const [step, setStep] = React.useState<string | undefined>();

  const nextTask = (taskNumber: string) => {
    localStorage.setItem("step", taskNumber);
    setStep(taskNumber);
  };

  const success = (position: any) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  React.useEffect(() => {
    if (!step) setStep(localStorage.getItem("step") || "0");
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(success);
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

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
