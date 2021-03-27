import * as React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import API from "../../utils/keys";
import { ILocation } from "../../utils/types";
import bunnyPin from "../../assets/bunny-pin.png";
import { EasterContext } from "../../context/EasterContext";

interface IMapComponent {
  locationCallback?: (cord: ILocation) => void;
  // todo setCenterInput
}

const MapComponent: React.FC<IMapComponent> = ({
  children,
  locationCallback,
}) => {
  const { currentPosition } = React.useContext(EasterContext);
  const defaultCenter = {
    lat: 58.183348,
    lng: 8.092905,
  };

  const mapContainer = {
    minHeight: "50vh",
    width: "100%",
  };

  return (
    <LoadScript googleMapsApiKey={API.GOOGLE}>
      <GoogleMap
        mapContainerStyle={mapContainer}
        zoom={15}
        center={currentPosition || defaultCenter}
        onClick={(e) =>
          locationCallback &&
          locationCallback({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        }
      >
        {children}
        {currentPosition && (
          <Marker position={currentPosition} icon={{ url: bunnyPin }} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
