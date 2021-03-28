import React from "react";
import { IHunt } from "../../utils/types";
import moment from "moment";
import { Form, Input, Button, DatePicker, Card, Popconfirm } from "antd";
import locale from "antd/es/date-picker/locale/nb_NO";
import WriteData from "../../api/writeData";
const { TextArea } = Input;

interface IEditHunt {
  hunt: IHunt;
  reload: () => void;
}

const HuntEditor: React.FC<IEditHunt> = ({ hunt, reload }) => {
  const [name, setName] = React.useState(hunt.name);

  const [activeDate, setActiveDate] = React.useState(hunt.activeDate);
  const [finishTitle, setFinishTitle] = React.useState<string>(
    hunt.finishTitle
  );
  const [finishText, setFinishText] = React.useState<string>(hunt.finishText);

  const deleteHunt = () => {
    WriteData.deleteHunt(hunt.huntId).then(() => {
      reload();
    });
  };

  const updateHunt = () => {
    WriteData.updateHunt(hunt.huntId, { ...hunt, activeDate, name }).then(() =>
      reload()
    );
  };

  return (
    <div>
      <Card
        actions={[
          <Popconfirm
            title="Er du sikker på at du vil slette påskejakten og alle tilhørende oppgaver?"
            onConfirm={() => deleteHunt()}
            onCancel={() => {}}
            okText="Ja"
            cancelText="Nei"
          >
            <Button danger>Slett</Button>
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
    </div>
  );
};

export default HuntEditor;
