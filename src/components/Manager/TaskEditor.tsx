import React from "react";
import { ILocation, ITask } from "../../utils/types";
import { Button, Card, Radio, Form, Input } from "antd";
import Loading from "../Loading";
import { CheckCircleTwoTone, DeleteOutlined } from "@ant-design/icons";
import MapComponent from "../Map/MapComponent";
import EggMarker from "../Map/EggMarker";
import WriteData from "../../api/writeData";
import ViewPosition from "../EasterHunt/ViewPosition";
import TaskImageEditor from "./TaskImageEditor";
import GetData from "../../api/getData";
import Error from "../Error";
import IsTaskReady from "./IsTaskReady";
const { Search } = Input;

interface ITaskEditor {
  huntId: string;
  taskId: string;
  back: () => void;
  deleteTask: (taskId: string) => void;
}

const TaskEditor: React.FC<ITaskEditor> = ({
  huntId,
  taskId,
  deleteTask,
  back,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [alternativeValue, setAlternativeValue] = React.useState<string>("");

  const [task, setTask] = React.useState<ITask>();
  const [originTask, setOriginTask] = React.useState<ITask>();

  const [error, setError] = React.useState(false);

  const [reloadKey, setReloadKey] = React.useState(Date.now());
  const reload = () => setReloadKey(Date.now);

  const [selectPosition, setSelectPosition] = React.useState(false);

  React.useEffect(() => {
    if (taskId) {
      setLoading(true);
      GetData.getTask(taskId)
        .then((data: any) => {
          setOriginTask(data);
          setTask(data);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [taskId, reloadKey]);

  const handleChange = (e: any) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    //@ts-ignore
    setTask({ ...task, [name]: value });
  };

  const positionCallback = (position: ILocation) => {
    // @ts-ignore
    setTask({ ...task, location: position });
  };

  const alternativeEqual = () => {
    if (originTask && task) {
      const equals =
        JSON.stringify(originTask.alternatives) ===
        JSON.stringify(task.alternatives);
      const correct = originTask.correct === task.correct;
      return equals && correct;
    }
  };

  const addAlternative = (value: string) => {
    let newAlternatives = (task &&
      task.alternatives &&
      task.alternatives.concat(value)) || [value];
    //@ts-ignore
    setTask({ ...task, alternatives: newAlternatives });
  };

  const removeAlternative = (value: string) => {
    let newAlternatives =
      task &&
      task.alternatives &&
      task.alternatives.filter((target) => target !== value);
    //@ts-ignore
    setTask({ ...task, alternatives: newAlternatives });
  };

  const saveTaskData = (changes: ITask) => {
    WriteData.updateTask(taskId, changes)
      .then(() => {
        reload();
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  const saveChangesButton = (key: string) => {
    // @ts-ignore
    if (originTask && task && originTask[key] === task[key]) return null;
    // @ts-ignore
    return (
      <>
        <br />
        <Button
          type={"primary"}
          // @ts-ignore
          onClick={() => saveTaskData({ [key]: task[key] })}
        >
          Lagre endring
        </Button>
      </>
    );
  };

  if (loading || !task) return <Loading />;

  if (error) return <Error />;

  if (selectPosition)
    return (
      <div>
        <Button
          block
          type={"primary"}
          onClick={() => {
            setSelectPosition(false);
            // @ts-ignore
            saveTaskData({ location: task.location });
          }}
        >
          Lagre posisjon
        </Button>
        <Card>
          <ViewPosition position={task.location} />
        </Card>
        <MapComponent locationCallback={positionCallback}>
          {task.location && <EggMarker location={task.location} />}
        </MapComponent>
      </div>
    );

  const editView = () => {
    return (
      <Form layout="vertical">
        <Form.Item label="Oppgave tekst">
          <Input
            name={"description"}
            value={task.description || ""}
            onChange={(e) => handleChange(e)}
          />
          {saveChangesButton("description")}
        </Form.Item>
        <Form.Item label="Oppgave type">
          <Radio.Group
            name={"type"}
            onChange={(e) => handleChange(e)}
            value={task.type}
          >
            <Radio value={"tekst"}>Tekst svar</Radio>
            <Radio value={"flervalg"}>Flervalgsoppgave</Radio>
          </Radio.Group>
          {saveChangesButton("type")}
        </Form.Item>

        {originTask && originTask.type === "tekst" && (
          <Form.Item label="Riktig svar">
            <Input
              name={"correct"}
              value={task.correct || ""}
              onChange={(e) => handleChange(e)}
            />
            {saveChangesButton("correct")}
          </Form.Item>
        )}

        {originTask && originTask.type === "flervalg" && (
          <>
            <Form.Item label="Alternativer">
              <Search
                placeholder="Nytt alternativ"
                allowClear
                value={alternativeValue}
                onChange={(e) => setAlternativeValue(e.target.value)}
                enterButton="Legg til"
                onSearch={(verdi) => {
                  setAlternativeValue("");
                  addAlternative(verdi);
                }}
              />

              {task.alternatives && (
                <div>
                  Trykk på riktig alternativ som er riktig for å sette riktig
                  svar.
                  {task.alternatives.map((a) => (
                    <div style={{ padding: "10px" }}>
                      {task.correct !== a && (
                        <Button onClick={() => removeAlternative(a)}>
                          <DeleteOutlined />
                        </Button>
                      )}

                      <Button onClick={() => setTask({ ...task, correct: a })}>
                        {a}
                      </Button>
                      {task.correct === a && (
                        <span style={{ marginLeft: "10px" }}>
                          <CheckCircleTwoTone twoToneColor="#52c41a" /> Valgt
                          som riktig svar{" "}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!alternativeEqual() && (
                <>
                  <br />
                  <Button
                    block
                    type={"primary"}
                    onClick={() =>
                      //@ts-ignore
                      saveTaskData({
                        type: task.type,
                        alternatives: task.alternatives,
                        correct: task.correct,
                      })
                    }
                  >
                    Lagre endring
                  </Button>
                </>
              )}
            </Form.Item>
          </>
        )}
        <hr />
        <Form.Item
          label="Oppgave lokasjon"
          tooltip={
            "Setter lokasjon for oppgaven. Man må være innenfor en radius på 20m til valgt lokasjon for å få opp oppgaven. Er ingen lokasjon satt vil oppgaven vises uten at man trenger å forflytte seg til den."
          }
        >
          <Button onClick={() => setSelectPosition(true)}>Velg lokasjon</Button>
          {/*//@ts-ignore*/}
          <Button danger onClick={() => saveTaskData({ location: null })}>
            Slett lokasjon
          </Button>

          <ViewPosition position={task.location} />
        </Form.Item>
        <hr />
        <Form.Item label="Oppgave bilde">
          <TaskImageEditor
            huntId={huntId}
            taskId={task.taskId}
            image={task.image}
            // @ts-ignore
            setImage={(imageUrl: string) => saveTaskData({ image: imageUrl })}
          />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Card
      title={"Oppgave info"}
      extra={<IsTaskReady task={task} />}
      actions={[
        <Button danger onClick={() => deleteTask(task.taskId)}>
          Slett oppgave
        </Button>,
        <Button onClick={() => back()}>Ferdig</Button>,
        // <Button onClick={() => saveTask()} type="primary">
        //   Lagre
        // </Button>,
      ]}
      style={{ marginTop: 10 }}
    >
      {editView()}
    </Card>
  );
};

export default TaskEditor;
