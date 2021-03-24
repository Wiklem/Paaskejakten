import React from "react";
import { Modal, Button } from "antd";
import { Input } from "antd";
import { Alert } from "antd";
import logo from "../assets/easter-egg.svg";
import Countdown from "../components/Countdown";
import TaskList from "./EasterHunt/TaskList";
import styles from "./Landingpage.module.css";

interface ILandingpage {
  dev?: boolean;
}

const Landingpage: React.FC<ILandingpage> = ({ dev }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setError("");
    if (name === "Mina") {
      localStorage.setItem("name", name);
      setIsModalVisible(false);
    } else {
      setError("Du er desverre ikke med i påskejakten!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (localStorage.getItem("name") === "Mina") {
    return <TaskList />;
  }
  const startHunt = () => (
    <>
      <Button type="primary" onClick={showModal}>
        Start påskejakten
      </Button>
      <Modal
        title="Velkommen"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Avbryt
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>,
        ]}
      >
        {error && <Alert message={error} type="error" showIcon />}
        <p>Hvem er du?</p>
        <Input placeholder={"navn"} onChange={(e) => setName(e.target.value)} />
      </Modal>
    </>
  );

  return (
    <>
      {ready || dev ? startHunt() : <Countdown readyCallback={setReady} />}
      <img className={styles.easterEgg} src={logo} alt="logo" />
    </>
  );
};

export default Landingpage;
