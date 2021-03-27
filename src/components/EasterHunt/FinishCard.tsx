import * as React from "react";
import { Card } from "antd";
import { IHunt } from "../../utils/types";

interface IFinishCard {
  hunt: IHunt;
}

const FinishCard: React.FC<IFinishCard> = ({ hunt }) => {
  return (
    <Card title={hunt.finishTitle}>
      <p>{hunt.finishText}</p>
    </Card>
  );
};

export default FinishCard;
