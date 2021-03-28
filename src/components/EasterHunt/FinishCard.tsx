import * as React from "react";
import { Button, Card } from "antd";
import { IHunt } from "../../utils/types";

interface IFinishCard {
  hunt: IHunt;
}

const FinishCard: React.FC<IFinishCard> = ({ hunt }) => {
  return (
    <Card
      title={hunt.finishTitle}
      actions={[
        <Button
          onClick={() => {
            localStorage.setItem(hunt.huntId, "1");
            window.location.reload();
          }}
        >
          Restart
        </Button>,
      ]}
    >
      <p>{hunt.finishText}</p>
    </Card>
  );
};

export default FinishCard;
