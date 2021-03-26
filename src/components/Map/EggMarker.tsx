import React from "react";
import logo from "../../assets/easter-egg.svg";
import { Marker } from "@react-google-maps/api";
import { ILocation } from "../../utils/types";

interface IEggMarker {
  location: ILocation;
}

const EggMarker: React.FC<IEggMarker> = ({ location }) => {
  const [showInfo, setShowInfo] = React.useState(false);
  return (
    <Marker
      position={location}
      onClick={() => setShowInfo(!showInfo)}
      icon={{
        url: logo,
        scaledSize:
          window &&
          //@ts-ignore
          window.google &&
          //@ts-ignore
          window.google.maps &&
          //@ts-ignore
          new window.google.maps.Size(100, 100),
      }}
    />
  );
};

export default EggMarker;
