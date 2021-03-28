import React from "react";
import { IHunt, ILocation, ITask } from "../../utils/types";
import { Button, Card, Radio, Form, Input, Tooltip } from "antd";
import Loading from "../Loading";
import { CheckCircleTwoTone, FrownTwoTone } from "@ant-design/icons";
import MapComponent from "../Map/MapComponent";
import EggMarker from "../Map/EggMarker";
import WriteData from "../../api/writeData";
const { Search } = Input;

interface ITaskEditor {
  huntId: IHunt["huntId"];
  task: ITask;
  number: number;
  reload: () => void;
  deleteTask: (taskId: string) => void;
}

const TaskEditor: React.FC<ITaskEditor> = ({
  number,
  task,
  reload,
  deleteTask,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
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
        setEdit(false);
        reload();
      })
      .finally(() => setLoading(false));
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
        <Button block type={"primary"} onClick={() => setSelectPosition(false)}>
          Lukk kart
        </Button>
        <Card> {viewPosition()} </Card>
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
          <Tooltip title="Oppgaven er klar">
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          </Tooltip>
        ) : (
          <Tooltip title="Oppgaven er ufulstendig og vil ikke vises i jakten">
            <FrownTwoTone twoToneColor={"red"} />
          </Tooltip>
        )
      }
      actions={
        edit
          ? [
              <Button danger onClick={() => deleteTask(task.taskId)}>
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
          <Button disabled={!edit} danger onClick={() => setPosition(null)}>
            Slett lokasjon
          </Button>

          <br />
          {viewPosition()}
        </Form.Item>
        <Form.Item label="Oppgave tekst">
          <Input
            disabled={!edit}
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Oppgave type">
          <Radio.Group
            disabled={!edit}
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
              disabled={!edit}
              value={correct || ""}
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
