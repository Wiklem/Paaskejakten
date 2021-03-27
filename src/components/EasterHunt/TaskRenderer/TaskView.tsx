import React from "react";
import { Alert, Button, Input, Radio } from "antd";
import { ITask } from "../../../utils/types";
import styles from "./TaskView.module.css";
import { EasterContext } from "../../../context/EasterContext";

interface ITaskView {
  task: ITask;
}
const TaskView: React.FC<ITaskView> = ({ task }) => {
  const { nextTask } = React.useContext(EasterContext);
  const [answer, setAnswer] = React.useState<string | undefined>(undefined);
  const correctView = () => (
    <div className={styles.answerLabel}>
      <Alert message={answer + " er riktig"} type="success" showIcon />
      <div>
        <Button
          className={styles.nextButton}
          type="primary"
          block
          onClick={() => nextTask()}
        >
          Fortsett
        </Button>
      </div>
    </div>
  );

  const incorrectView = () => (
    <div className={styles.answerLabel}>
      <Alert message={answer + " er feil"} type="error" showIcon />
    </div>
  );

  const inputOptions = () =>
    task.type === "flervalg" ? (
      <Radio.Group onChange={(e) => setAnswer(e.target.value)} value={answer}>
        {task.alternatives &&
          task.alternatives.map((a) => <Radio value={a}>{a}</Radio>)}
      </Radio.Group>
    ) : (
      <Input.Search
        allowClear
        enterButton="Ok"
        size="large"
        placeholder="Angi svar"
        onSearch={(value) => setAnswer(value)}
      />
    );

  return (
    <>
      <strong>{task.description}</strong>
      {inputOptions()}
      {answer !== undefined
        ? answer.toLowerCase() === task.correct?.toLowerCase()
          ? correctView()
          : incorrectView()
        : null}
    </>
  );
};

export default TaskView;
