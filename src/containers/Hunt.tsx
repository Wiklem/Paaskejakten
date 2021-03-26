import React from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { functionUrl } from "../utils/api";
import { Result, Button, Card } from "antd";
import { IHunt, ITask } from "../utils/types";
import { EasterContext } from "../context/EasterContext";
import TaskRenderer from "./EasterHunt/TaskRenderer/TaskRenderer";
import Countdown from "../components/Countdown";
import Loading from "../components/Loading";

const Hunt: React.FC = () => {
  //@ts-ignore
  const { id } = useParams();
  const { step } = React.useContext(EasterContext);
  const [hunt, setHunt] = React.useState<IHunt>();
  const [tasks, setTasks] = React.useState<Array<ITask>>();
  const [error, setError] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  const fetchData = () => {
    if (id) {
      axios
        .post(functionUrl + "getHunt", { huntId: id })
        .then((res) => setHunt(res.data))
        .catch((e) => setError(true));
    }
    if (id && !tasks) {
      axios
        .post(functionUrl + "getTasks", { huntId: id })
        .then((res) => setTasks(res.data))
        .catch((e) => setError(true));
    }
  };
  React.useEffect(() => {
    fetchData();
  });

  if (error)
    return (
      <Card>
        <Result
          status="404"
          title="404"
          subTitle="Fant ikke oppgaven med gitt id."
          extra={
            <Link to={"/"}>
              <Button type="primary">Tilbake</Button>
            </Link>
          }
        />
      </Card>
    );

  const renderTasks = () =>
    tasks && tasks.length ? (
      tasks
        .filter((task) => task.location && task.description && task.correct)
        .map((task, key) => {
          if (key + 1 === step) {
            return <TaskRenderer key={key} task={task} taskKey={key} />;
          }

          return null;
        })
    ) : (
      <div> Denne påskejakten har ingen oppgaver..</div>
    );

  if (!hunt) return <Loading />;

  return (
    <div>
      {hunt.name}
      {hunt.activeDate ? (
        ready ? (
          renderTasks()
        ) : (
          <Countdown time={hunt.activeDate} readyCallback={setReady} />
        )
      ) : (
        renderTasks()
      )}
    </div>
  );
};

export default Hunt;
