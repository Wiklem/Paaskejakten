import React from "react";
import styles from "./Layout.module.css";
import { Avatar, Button } from "antd";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";

interface IHeader {}

const Header: React.FC<IHeader> = () => {
  const { user, signIn, signOut } = React.useContext(AuthContext);
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerItem}>
          <Avatar src={logo} />
        </div>
        <Link to={"/"}>
          <h1 className={styles.rainbow}>Påskejakten</h1>
        </Link>
        <div className={styles.headerItem}>
          {user ? (
            <>
              <Link to={"/administrer"}>
                <Button icon={<LogoutOutlined />}>Mine påskejakter</Button>
              </Link>
              <Button icon={<LogoutOutlined />} onClick={signOut}>
                Logg ut
              </Button>
            </>
          ) : (
            <Button icon={<LoginOutlined />} onClick={signIn}>
              Logg inn
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
