import React from "react";
import { Button, Card } from "antd";
import { Input } from "antd";
import logo from "../assets/easter-egg.svg";
import { Link } from "react-router-dom";
import styles from "./Landingpage.module.css";

const Landingpage: React.FC = () => {
  const [code, setCode] = React.useState("");

  return (
    <>
      <Card title={"Påskejakt kode"} style={{ width: 300 }}>
        <Input
          placeholder={"Påske kode"}
          onChange={(e) => setCode(e.target.value)}
        />
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
