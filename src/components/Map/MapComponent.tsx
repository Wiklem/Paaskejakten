import * as React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { ILocation } from "../../utils/types";
import bunnyPin from "../../assets/bunny-pin.png";
import { EasterContext } from "../../context/EasterContext";

interface IMapComponent {
  locationCallback?: (cord: ILocation) => void;
}

const MapComponent: React.FC<IMapComponent> = ({
  children,
  locationCallback,
}) => {
  const { currentPosition } = React.useContext(EasterContext);
  const [defaultCenter, setDefaultCenter] = React.useState<ILocation>();

  const mapContainer = {
    minHeight: "50vh",
    width: "100%",
  };

  React.useEffect(() => {
    // let inUse = true;
    if (!defaultCenter) {
      if (currentPosition) {
        setDefaultCenter(currentPosition);
      } else {
        setDefaultCenter({ lat: 58.183348, lng: 8.092905 });
      }
    }
    // return () => {
    //   inUse = false;
    // };
  });
  return (
    <GoogleMap
      mapContainerStyle={mapContainer}
      zoom={15}
      center={currentPosition || defaultCenter}
      onClick={(e) =>
        locationCallback &&
        locationCallback({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      }
    >
      {children && children}
      {currentPosition && (
        <Marker position={currentPosition} icon={{ url: bunnyPin }} />
      )}
    </GoogleMap>
  );
};

export default MapComponent;
