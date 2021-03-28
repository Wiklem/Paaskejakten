import * as React from "react";
import GetData from "../../api/getData";
import { ITask } from "../../utils/types";
import { Button, Card, Tooltip } from "antd";
import Loading from "../Loading";
import moment from "moment";
import TaskEditor from "./TaskEditor";
import WriteData from "../../api/writeData";
import { CheckCircleTwoTone, FrownTwoTone } from "@ant-design/icons";
import TaskView from "../EasterHunt/TaskRenderer/TaskView";
import ViewPosition from "../EasterHunt/ViewPosition";
import Error from "../Error";

interface IManageTasks {
  huntId: string;
}

const ManageTasks: React.FC<IManageTasks> = ({ huntId }) => {
  const [editTask, setEditTask] = React.useState<string | undefined>(undefined);
  const [data, setData] = React.useState<Array<ITask>>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const [reloadKey, setReloadKey] = React.useState(Date.now());
  const reload = () => setReloadKey(Date.now);

  const newTask = () => {
    setLoading(true);
    WriteData.newTask(huntId).then(() => reload());
  };

  const deleteTask = (taskId: string) => {
    setLoading(true);
    WriteData.deleteTask(taskId).then(() => {
      reload();
    });
  };

  React.useEffect(() => {
    if (huntId) {
      setLoading(true);
      GetData.getTasks(huntId)
        .then((data: any) => setData(data))
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [huntId, reloadKey]);

  if (editTask) {
    return (
      <TaskEditor
        huntId={huntId}
        taskId={editTask}
        back={() => setEditTask(undefined)}
        deleteTask={deleteTask}
      />
    );
  }

  const viewTask = (number: number, ready: boolean, task: ITask) => {
    return (
      <Card
        key={number}
        title={"Oppgave " + number}
        extra={
          ready ? (
            <Tooltip title="Oppgaven er klar">
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            </Tooltip>
          ) : (
            <Tooltip title="Oppgaven er ufulstendig og vil ikke vises i jakten">
              <FrownTwoTone twoToneColor={"red"} />
            </Tooltip>
          )
        }
        actions={[
          <Button onClick={() => setEditTask(task.taskId)}>Endre</Button>,
        ]}
        style={{ marginTop: 10 }}
      >
        <div>
          <ViewPosition position={task.location} />
          <br />
          <TaskView task={task} />
        </div>
      </Card>
    );
  };

  if (error) return <Error />;

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <Button type={"primary"} block onClick={() => newTask()}>
          Ny Oppgave
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {loading ? (
          <Loading />
        ) : data ? (
          data
            .sort((a, b) => moment(a.date).unix() - moment(b.date).unix())
            .map((task, key) => {
              return viewTask(key + 1, true, task);
            })
        ) : (
          "Det er ingen oppgaver i denne påskejakten"
        )}
      </div>
    </div>
  );
};

export default ManageTasks;
