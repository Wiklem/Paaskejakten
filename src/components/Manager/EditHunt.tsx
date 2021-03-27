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
import { functionUrl } from "../../utils/api";
import axios from "axios";
import locale from "antd/es/date-picker/locale/nb_NO";
import TaskEditor from "./TaskEditor";
import Loading from "../Loading";
const { TextArea } = Input;

interface IEditHunt {
  hunt: IHunt;
  back: () => void;
}

const EditHunt: React.FC<IEditHunt> = ({ hunt, back }) => {
  const [name, setName] = React.useState(hunt.name);
  const [activeDate, setActiveDate] = React.useState(hunt.activeDate);
  const [tasks, setTasks] = React.useState<Array<ITask>>([]);
  const [finishTitle, setFinishTitle] = React.useState<string>(
    hunt.finishTitle
  );
  const [finishText, setFinishText] = React.useState<string>(hunt.finishText);
  const [reloadState, setReload] = React.useState(Date.now());
  const [loading, setLoading] = React.useState(true);

  const reload = () => setReload(Date.now());

  const deleteHunt = () => {
    setLoading(true);
    axios
      .post(functionUrl + "deleteHunt", { huntId: hunt.huntId })
      .then(() => back());
  };

  const newTask = () => {
    setLoading(true);
    axios
      .post(functionUrl + "newTask", { huntId: hunt.huntId })
      .then(() => reload());
  };

  const updateHunt = () => {
    axios
      .post(functionUrl + "updateHunt", {
        huntId: hunt.huntId,
        activeDate,
        name,
      })
      .then(() => reload());
  };

  const getTasks = () =>
    axios
      .post(functionUrl + "getTasks", { huntId: hunt.huntId })
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      });

  React.useEffect(() => {
    reloadState && getTasks();
  }, [reloadState]);

  return (
    <div>
      <PageHeader
        style={{ backgroundColor: "white", width: "80vw" }}
        onBack={() => back()}
        title={name}
        subTitle={"Opprettet: " + moment(hunt.date).format("DD.MM.YYYY")}
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
        <Form labelCol={{ span: 2 }} layout="horizontal">
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
              defaultPickerValue={
                activeDate && moment(activeDate, "DD-MM-YYYY")
              }
              showTime
              onChange={(date, dateString) =>
                setActiveDate(new Date(dateString))
              }
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
      <Button onClick={() => newTask()}> Ny Oppgave</Button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {loading ? (
          <Loading />
        ) : tasks ? (
          tasks.map((task, key) => {
            return (
              <TaskEditor
                number={key + 1}
                key={key}
                huntId={hunt.huntId}
                task={task}
                reload={() => reload()}
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

export default EditHunt;
