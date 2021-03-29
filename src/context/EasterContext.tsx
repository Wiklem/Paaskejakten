import React from "react";
import Loading from "../components/Loading";
import { ILocation } from "../utils/types";
import { LoadScript } from "@react-google-maps/api";
import API from "../utils/keys";

interface IEasterContext {
  currentPosition: ILocation | null;
}
export const EasterContext = React.createContext<IEasterContext>({
  currentPosition: null,
});

const EasterContextProvider: React.FC = ({ children }) => {
  const [currentPosition, setCurrentPosition] = React.useState<ILocation>();

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
      <LoadScript googleMapsApiKey={API.GOOGLE}> {children} </LoadScript>
    </EasterContext.Provider>
  );
};

export default EasterContextProvider;
