import React from "react";
import { Alert, Button, Input, Modal } from "antd";
import axios from "axios";
import { functionUrl } from "../../utils/api";

interface INewHunt {
  id: string;
  reload: () => void;
}

const NewHunt: React.FC<INewHunt> = ({ id, reload }) => {
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleOk = () => {
    if (name) {
      setLoading(true);
      axios
        .post(functionUrl + "newHunt", { id, name })
        .then(() => {
          setLoading(false);
          setIsModalVisible(false);
          reload();
        })
        .catch((e) => {
          e.response && e.response.data && setError(e.response.data.message);
          setLoading(false);
        });
    } else {
      setError("Du må velge et navn!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type={"primary"} onClick={() => setIsModalVisible(true)}>
        Opprett en ny påskejakt
      </Button>
      <Modal
        title="Opprett ny påskejakt"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Avbryt
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
          >
            Ok
          </Button>,
        ]}
      >
        {error && <Alert message={error} type="error" showIcon />}
        <p>Hva skal påskejakten hete?</p>
        <Input
          placeholder={"Navn på jakt"}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default NewHunt;
