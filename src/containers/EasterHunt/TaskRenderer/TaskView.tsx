import React from "react";
import { Alert, Button, Input } from "antd";
import { EasterContext } from "../../../components/EasterContext";
import { ITask } from "../../../api/types";
import styles from "./TaskView.module.css";

interface ITaskView {
  task: ITask;
}
const TaskView: React.FC<ITaskView> = ({ task }) => {
  const { nextTask } = React.useContext(EasterContext);
  const [answer, setAnswer] = React.useState<string | undefined>(undefined);

  const correctView = () => (
    <div>
      <Alert message={answer + " er riktig"} type="success" showIcon />
      <div>
        <Button
          onClick={() => {
            let nextVal = parseInt(task.number);
            nextVal++;
            nextTask(nextVal.toString());
          }}
        >
          Gå til neste oppgave
        </Button>
      </div>
    </div>
  );

  const incorrectView = () => (
    <div>
      <Alert message={answer + " er feil"} type="error" showIcon />
    </div>
  );

  return (
    <div className={styles.taskContainer}>
      <div>{task.taskInfo}</div>
      <Input.Search
        allowClear
        enterButton="Ok"
        size="large"
        placeholder="Angi svar"
        onSearch={(value) => setAnswer(value)}
      />
      {answer !== undefined
        ? answer === task.correctAnswer
          ? correctView()
          : incorrectView()
        : null}
    </div>
  );
};

export default TaskView;
