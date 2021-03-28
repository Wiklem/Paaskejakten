import React from "react";
import { Button, Card, Form } from "antd";
import { Input } from "antd";
import logo from "../assets/easter-egg.svg";
import { Link } from "react-router-dom";
import styles from "./Landingpage.module.css";

const Landingpage: React.FC = () => {
  const [code, setCode] = React.useState("");

  return (
    <>
      <Card title={"Velkommen til påskejakten!"}>
        <Form layout="vertical">
          <Form.Item
            label="Påskejakt kode"
            tooltip={
              "Her skriver du inn koden du har fått for å starte påskejakten"
            }
          >
            <Input
              placeholder={"kode"}
              onChange={(e) => setCode(e.target.value)}
            />
          </Form.Item>
        </Form>

        <Link to={"/jakt/" + code}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Button key="submit" type="primary" disabled={!code}>
              Start
            </Button>
          </div>
        </Link>
      </Card>
      <img className={styles.easterEgg} src={logo} alt="logo" />
    </>
  );
};

export default Landingpage;
