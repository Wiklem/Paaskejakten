import React from "react";
import { Layout as AntLayout } from "antd";
import styles from "../../containers/Landingpage.module.css";

interface IHeader {}

const Header: React.FC<IHeader> = () => {
  return (
    <AntLayout.Header>
      <h1 className={styles.rainbowText}>Påskejakten</h1>
    </AntLayout.Header>
  );
};

export default Header;
