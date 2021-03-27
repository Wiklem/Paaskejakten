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
    const nextStep = step + 1;
    localStorage.setItem("step", nextStep.toString());
    setStep(nextStep);
  };

  const success = (position: any) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  React.useEffect(() => {
    if (step === 1) {
      const storedStep = localStorage.getItem("step");
      if (storedStep && parseInt(storedStep) !== step) {
        setStep(parseInt(storedStep));
      }
    }
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
