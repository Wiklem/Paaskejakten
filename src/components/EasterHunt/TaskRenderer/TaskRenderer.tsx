import React from "react";
import { ITask } from "../../../utils/types";
import MapComponent from "../../Map/MapComponent";
import MapDistance from "../../Map/MapDistance";
import TaskView from "./TaskView";
import { Card } from "antd";
import EggMarker from "../../Map/EggMarker";

interface IdistanceValues {
  text: string;
  value: number;
}

interface ITaskRenderer {
  task: ITask;
  taskKey: number;
}

const TaskRenderer: React.FC<ITaskRenderer> = ({ taskKey, task }) => {
  const [distanceValues, setDistanceValues] = React.useState<IdistanceValues>();
  const [distance, setDistance] = React.useState<any>();
  const [showTask, setShowTask] = React.useState(false);

  React.useEffect(() => {
    if (task.location && distance) {
      const distanceValues = distance.rows[0].elements[0].distance;
      if (distanceValues.value <= 10) {
        setShowTask(true);
        setDistanceValues(distanceValues);
      } else {
        setShowTask(false);
        setDistanceValues(distanceValues);
      }
    } else {
      setShowTask(true);
    }
  }, [distance]);

  const distanceToUnlock = () => {
    if (distanceValues && distanceValues.text)
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>Du er {distanceValues.text} unna å låse opp oppgaven!</h2>
        </div>
      );
  };

  const renderMap = () => (
    <MapComponent>
      <>
        <MapDistance location={task.location} distanceCallback={setDistance} />
        {task.location && <EggMarker location={task.location} />}
      </>
    </MapComponent>
  );

  return (
    <Card title={<strong>Oppgave {taskKey + 1}</strong>} cover={task.cover}>
      {showTask ? (
        <TaskView task={task} />
      ) : (
        <>
          {distanceToUnlock()} {renderMap()}
        </>
      )}
    </Card>
  );
};

export default TaskRenderer;
