import * as React from "react";
import { Alert } from "antd";
import { ILocation } from "../../utils/types";

interface IViewPosition {
  position?: ILocation | null;
}

const ViewPosition: React.FC<IViewPosition> = ({ position }) => {
  return (
    <Alert
      message={
        position ? (
          <div>
            <span> Latitude: {position.lat || "N/A"} </span>
            <br />
            <span> Longitute: {position.lng || "N/A"} </span>
          </div>
        ) : (
          <span>Oppgaven har ingen kart posisjon</span>
        )
      }
      type="info"
    />
  );
};

export default ViewPosition;
