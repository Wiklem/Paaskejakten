import * as React from "react";
import { IHunt, ITask } from "../../utils/types";
import TaskRenderer from "./TaskRenderer/TaskRenderer";
import { EasterContext } from "../../context/EasterContext";
import FinishCard from "./FinishCard";
import Loading from "../Loading";
import { Button, Card, Result } from "antd";
import { Link } from "react-router-dom";
import GetData from "../../api/getData";

interface ITasks {
  hunt: IHunt;
}

const Tasks: React.FC<ITasks> = ({ hunt }) => {
  const { step } = React.useContext(EasterContext);

  const [data, setData] = React.useState<Array<ITask>>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (hunt.huntId) {
      setLoading(true);
      GetData.getTasks(hunt.huntId)
        .then((data: any) => setData(data))
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [hunt.huntId]);

  const availableTasks =
    data &&
    data.length &&
    data.filter((task: ITask) => task.description && task.correct);

  if (loading) return <Loading />;
  if (error) {
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
  }

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
export default Tasks;
