import React from "react";
import Loading from "../components/Loading";

interface IEasterContext {
  currentPosition: object;
}
export const EasterContext = React.createContext<IEasterContext>({
  currentPosition: {},
});

const EasterContextProvider: React.FC = ({ children }) => {
  const [currentPosition, setCurrentPosition] = React.useState({});

  const success = (position: any) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(success);
    }, 1000);
    return () => clearInterval(interval);
  });

  if (!currentPosition) return <Loading />;
  return (
    <EasterContext.Provider
      value={{
        currentPosition,
      }}
    >
      {children}
    </EasterContext.Provider>
  );
};

export default EasterContextProvider;
