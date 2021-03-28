import React from "react";
import { IHunt, ITask } from "../../utils/types";
import moment from "moment";
import {
  PageHeader,
  Form,
  Input,
  Button,
  DatePicker,
  Card,
  Popconfirm,
} from "antd";
import locale from "antd/es/date-picker/locale/nb_NO";
import TaskEditor from "./TaskEditor";
import Loading from "../Loading";
import WriteData from "../../api/writeData";
import GetData from "../../api/getData";
const { TextArea } = Input;

interface IEditHunt {
  hunt: IHunt;
  back: () => void;
}

const HuntEditor: React.FC<IEditHunt> = ({ hunt, back }) => {
  const [name, setName] = React.useState(hunt.name);

  const [activeDate, setActiveDate] = React.useState(hunt.activeDate);
  const [finishTitle, setFinishTitle] = React.useState<string>(
    hunt.finishTitle
  );
  const [finishText, setFinishText] = React.useState<string>(hunt.finishText);

  const [data, setData] = React.useState<Array<ITask>>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(Date.now());
  const reload = () => setReloadKey(Date.now);

  const deleteHunt = () => {
    WriteData.deleteHunt(hunt.huntId).then(() => {
      back();
      reload();
    });
  };

  const newTask = () => {
    setLoading(true);
    WriteData.newTask(hunt.huntId).then(() => reload());
  };

  const deleteTask = (taskId: string) => {
    setLoading(true);
    WriteData.deleteTask(taskId).then(() => {
      reload();
    });
  };

  const updateHunt = () => {
    WriteData.updateHunt(hunt.huntId, { ...hunt, activeDate, name }).then(() =>
      reload()
    );
  };

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
  }, [hunt.huntId, reloadKey]);

  console.log(activeDate);
  return (
    <div>
      <PageHeader
        style={{ backgroundColor: "white" }}
        onBack={() => back()}
        title={name}
        subTitle={
          <>
            <span>Opprettet: {moment(hunt.date).format("DD.MM.YYYY")}</span>
            <br />
            <span>
              Kode: <strong>{hunt.huntId}</strong>
            </span>
          </>
        }
      />
      <Card
        actions={[
          <Popconfirm
            title="Er du sikker på at du vil slette påskejakten og alle tilhørende oppgaver?"
            onConfirm={() => deleteHunt()}
            onCancel={() => {}}
            okText="Ja"
            cancelText="Nei"
          >
            <Button danger loading={loading}>
              Slett påskejakten
            </Button>
          </Popconfirm>,
          <Button onClick={() => updateHunt()}>Lagre</Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label="Name"
            tooltip={"Navnet som skal vises for påskejakten"}
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Aktiv dato"
            tooltip={
              "Dato påskejakten skal bli aktiv. Hvis ingen dato blir satt er påskejakten automatisk aktiv."
            }
          >
            <DatePicker
              locale={locale}
              value={activeDate ? moment(activeDate) : null}
              showTime
              onChange={(date, dateString) => setActiveDate(dateString)}
            />
          </Form.Item>
          <Form.Item
            label="Ferdig tittel"
            tooltip={
              "Tittel på kortet som kommer opp når alle oppgavene i påskejakten er løst"
            }
          >
            <Input
              value={finishTitle}
              onChange={(e) => setFinishTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Ferdig tekst"
            tooltip={"Teksten i kortet som kommer opp når påskejakten er løst"}
          >
            <TextArea
              value={finishText}
              onChange={(e) => setFinishText(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Card>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <Button type={"primary"} onClick={() => newTask()}>
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
              return (
                <TaskEditor
                  number={key + 1}
                  key={key}
                  huntId={hunt.huntId}
                  task={task}
                  reload={() => reload()}
                  deleteTask={deleteTask}
                />
              );
            })
        ) : (
          "Det er ingen oppgaver i denne påskejakten"
        )}
      </div>
    </div>
  );
};

export default HuntEditor;
