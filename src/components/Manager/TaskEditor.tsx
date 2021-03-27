import React from "react";
import { IHunt, ILocation, ITask } from "../../utils/types";
import { Button, Card, Radio, Form, Input } from "antd";
import axios from "axios";
import { functionUrl } from "../../utils/api";
import Loading from "../Loading";
import { CheckCircleTwoTone, FrownTwoTone } from "@ant-design/icons";
import MapComponent from "../Map/MapComponent";
import EggMarker from "../Map/EggMarker";
const { Search } = Input;

interface ITaskEditor {
  huntId: IHunt["huntId"];
  task: ITask;
  number: number;
  reload: () => void;
}

const TaskEditor: React.FC<ITaskEditor> = ({ number, task, reload }) => {
  const [loading, setLoading] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [description, setDescription] = React.useState<string>(
    task.description
  );
  const [type, setType] = React.useState<string | undefined>(task.type);
  const [correct, setCorrect] = React.useState<string | undefined>(
    task.correct
  );
  const [alternatives, setAlternatives] = React.useState<Array<string>>(
    task.alternatives || []
  );
  const [position, setPosition] = React.useState<ILocation | undefined>(
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
  const deleteTask = () => {
    setLoading(true);
    axios
      .post(functionUrl + "deleteTask", { taskId: task.taskId })
      .then(() => reload());
  };

  const addAlternative = (value: string) => {
    setAlternatives(alternatives.concat(value));
  };

  const saveTask = () => {
    axios
      .post(functionUrl + "updateTask", {
        ...task,
        description,
        type,
        correct,
        alternatives,
        location: position,
      })
      .then(() => {
        setEdit(false);
        reload();
      });
  };

  const viewPosition = () => (
    <>
      <span> Latitude: {(position && position.lat) || "N/A"} </span>
      <span> Longitute: {(position && position.lng) || "N/A"} </span>
    </>
  );
  if (loading) return <Loading />;
  if (selectPosition)
    return (
      <div>
        <Button onClick={() => setSelectPosition(false)}>Lukk kart</Button>
        {viewPosition()}
        <MapComponent locationCallback={positionCallback}>
          {position && <EggMarker location={position} />}
        </MapComponent>
      </div>
    );

  return (
    <Card
      title={"Oppgave " + number}
      extra={
        ready ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <FrownTwoTone twoToneColor={"red"} />
        )
      }
      actions={
        edit
          ? [
              <Button danger onClick={() => deleteTask()}>
                Slett
              </Button>,
              <Button onClick={() => setEdit(!edit)}>Avbryt</Button>,
              <Button onClick={() => saveTask()} type="primary">
                Lagre
              </Button>,
            ]
          : [<Button onClick={() => setEdit(!edit)}>Endre</Button>]
      }
      style={{ marginTop: 10 }}
    >
      <Form layout="vertical">
        <Form.Item
          label="Oppgave lokasjon"
          tooltip={
            "Setter lokasjon for oppgaven. Man må være innenfor en radius på 20m til valgt lokasjon for å få opp oppgaven. Er ingen lokasjon satt vil oppgaven vises uten at man trenger å forflytte seg til den."
          }
        >
          <Button disabled={!edit} onClick={() => setSelectPosition(true)}>
            Velg lokasjon
          </Button>
          <Button
            disabled={!edit}
            danger
            onClick={() => setPosition(undefined)}
          >
            Slett lokasjon
          </Button>

          <br />
          {viewPosition()}
        </Form.Item>
        <Form.Item label="Oppgave tekst">
          <Input
            disabled={!edit}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Oppgave type">
          <Radio.Group
            disabled={!edit}
            onChange={(e) => {
              setType(e.target.value);
              setCorrect(undefined);
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
              disabled={!edit}
              value={correct}
              onChange={(e) => setCorrect(e.target.value)}
            />
          </Form.Item>
        )}

        {type === "flervalg" && (
          <>
            <Form.Item label="Alternativer">
              <Search
                disabled={!edit}
                placeholder="Nytt alternativ"
                allowClear
                enterButton="Legg til"
                onSearch={(verdi) => addAlternative(verdi)}
              />
              <Radio.Group
                disabled={!edit}
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
    </Card>
  );
};

export default TaskEditor;
