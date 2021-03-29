import * as React from "react";
import { Tooltip } from "antd";
import { CheckCircleTwoTone, FrownTwoTone } from "@ant-design/icons";
import { ITask } from "../../utils/types";

export const checkReady = (task: ITask): boolean => {
  if (!task) return false;
  const check = task.correct !== undefined && task.description !== undefined;
  if (task.type === "flervalg" && check) {
    if (task.alternatives && task.alternatives.length) {
      return true;
    }
  } else if (task.type && check) {
    return true;
  } else {
    return false;
  }
  return false;
};

interface IIsTaskReady {
  task?: ITask;
}

const IsTaskReady: React.FC<IIsTaskReady> = ({ task }) => {
  if (!task) return null;
  const ready = checkReady(task);

  return (
    <div>
      {ready ? (
        <Tooltip title="Oppgaven er klar">
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        </Tooltip>
      ) : (
        <Tooltip title="Oppgaven er ufulstendig og vil ikke vises i jakten">
          <FrownTwoTone twoToneColor={"red"} /> Oppgaven er ikke klar
        </Tooltip>
      )}
    </div>
  );
};

export default IsTaskReady;
