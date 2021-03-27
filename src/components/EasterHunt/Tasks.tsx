import * as React from "react";
import { IHunt, ITask } from "../../utils/types";
import TaskRenderer from "./TaskRenderer/TaskRenderer";
import { EasterContext } from "../../context/EasterContext";
import FinishCard from "./FinishCard";
import { apiStates, useApi } from "../../utils/api";
import Loading from "../Loading";
import { Button, Card, Result } from "antd";
import { Link } from "react-router-dom";

interface ITasks {
  hunt: IHunt;
}

const Tasks: React.FC<ITasks> = ({ hunt }) => {
  const { step } = React.useContext(EasterContext);
  const { process } = useApi("getTasks", {
    huntId: hunt.huntId,
  });

  const renderComponent = (data: Array<ITask>) => {
    const availableTasks =
      data &&
      data.length &&
      data.filter((task: ITask) => task.description && task.correct);

    if (availableTasks && step === availableTasks.length + 1) {
      return <FinishCard hunt={hunt} />;
    }
    return (
      <div>
        {availableTasks ? (
          availableTasks.map((task: ITask, key: number) => {
            if (key + 1 === step) {
              return <TaskRenderer key={key} task={task} taskKey={key} />;
            }
            return null;
          })
        ) : (
          <div> Denne påskejakten har ingen oppgaver..</div>
        )}
      </div>
    );
  };
  const renderProcess = (process: any) => {
    switch (process.state) {
      case apiStates.LOADING:
        return <Loading />;
      case apiStates.ERROR:
        return (
          <Card>
            <Result
              subTitle="Feil ved henting av oppgaver"
              extra={
                <Link to={"/"}>
                  <Button type="primary">Tilbake</Button>
                </Link>
              }
            />
          </Card>
        );
      case apiStates.SUCCESS:
        return renderComponent(process.data);
      default:
        return <Loading />;
    }
  };

  return renderProcess(process);
};
export default Tasks;
