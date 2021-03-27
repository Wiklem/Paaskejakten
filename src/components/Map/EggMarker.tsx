import React from "react";
import easterEgg from "../../assets/easter-egg.png";
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
      icon={{ url: easterEgg }}
    />
  );
};

export default EggMarker;
