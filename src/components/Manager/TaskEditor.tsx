import React from "react";
import { ILocation, ITask } from "../../utils/types";
import { Button, Card, Radio, Form, Input, Tooltip } from "antd";
import Loading from "../Loading";
import { CheckCircleTwoTone, FrownTwoTone } from "@ant-design/icons";
import MapComponent from "../Map/MapComponent";
import EggMarker from "../Map/EggMarker";
import WriteData from "../../api/writeData";
import ViewPosition from "../EasterHunt/ViewPosition";
const { Search } = Input;

interface ITaskEditor {
  task: ITask;
  number: number;
  reload: () => void;
  back: () => void;
  deleteTask: (taskId: string) => void;
}

const TaskEditor: React.FC<ITaskEditor> = ({
  number,
  task,
  reload,
  deleteTask,
  back,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [description, setDescription] = React.useState<string>(
    task.description
  );
  const [type, setType] = React.useState<string>(task.type);
  const [correct, setCorrect] = React.useState<string>(task.correct);
  const [alternatives, setAlternatives] = React.useState<Array<string>>(
    task.alternatives || []
  );
  const [position, setPosition] = React.useState<ILocation | null>(
    task.location
  );
  const [selectPosition, setSelectPosition] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  const checkReady = () => {
    const check = correct && description;

    if (type === "flervalg" && check) {
      return alternatives.length > 1 && setReady(true);
    } else if (type) {
      return setReady(true);
    } else {
      return setReady(false);
    }
  };

  const positionCallback = (position: ILocation) => {
    setPosition(position);
  };

  React.useEffect(() => {
    checkReady();
  });

  const addAlternative = (value: string) => {
    setAlternatives(alternatives.concat(value));
  };

  const saveTask = () => {
    setLoading(true);
    WriteData.updateTask(task.taskId, {
      ...task,
      description,
      type,
      correct,
      alternatives,
      location: position,
    })
      .then(() => {
        reload();
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <Loading />;
  if (selectPosition)
    return (
      <div>
        <Button block type={"primary"} onClick={() => setSelectPosition(false)}>
          Lukk kart
        </Button>
        <Card>
          <ViewPosition position={position} />
        </Card>
        <MapComponent locationCallback={positionCallback}>
          {position && <EggMarker location={position} />}
        </MapComponent>
      </div>
    );

  const editTask = () => {
    return (
      <Form layout="vertical">
        <Form.Item
          label="Oppgave lokasjon"
          tooltip={
            "Setter lokasjon for oppgaven. Man må være innenfor en radius på 20m til valgt lokasjon for å få opp oppgaven. Er ingen lokasjon satt vil oppgaven vises uten at man trenger å forflytte seg til den."
          }
        >
          <Button onClick={() => setSelectPosition(true)}>Velg lokasjon</Button>
          <Button danger onClick={() => setPosition(null)}>
            Slett lokasjon
          </Button>

          <br />
          <ViewPosition position={position} />
        </Form.Item>
        <Form.Item label="Oppgave tekst">
          <Input
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Oppgave type">
          <Radio.Group
            onChange={(e) => {
              setType(e.target.value);
              setCorrect("");
            }}
            value={type}
          >
            <Radio value={"tekst"}>Tekst svar</Radio>
            <Radio value={"flervalg"}>Flervalgsoppgave</Radio>
          </Radio.Group>
        </Form.Item>

        {type === "tekst" && (
          <Form.Item label="Riktig svar">
            <Input
              value={correct || ""}
              onChange={(e) => setCorrect(e.target.value)}
            />
          </Form.Item>
        )}

        {type === "flervalg" && (
          <>
            <Form.Item label="Alternativer">
              <Search
                placeholder="Nytt alternativ"
                allowClear
                enterButton="Legg til"
                onSearch={(verdi) => addAlternative(verdi)}
              />
              <Radio.Group
                defaultValue="a"
                size="large"
                onChange={(e) => setCorrect(e.target.value)}
              >
                {alternatives.map((a) => (
                  <Radio.Button value={a}>{a}</Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Riktig svar:">
              {correct ? (
                <span>{correct}</span>
              ) : (
                "Riktig svar ikke valgt. Trykk på et av alternativene"
              )}
            </Form.Item>
          </>
        )}
      </Form>
    );
  };

  return (
    <Card
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
        <Button danger onClick={() => deleteTask(task.taskId)}>
          Slett
        </Button>,
        <Button onClick={() => back()}>Avbryt</Button>,
        <Button onClick={() => saveTask()} type="primary">
          Lagre
        </Button>,
      ]}
      style={{ marginTop: 10 }}
    >
      {editTask()}
    </Card>
  );
};

export default TaskEditor;
