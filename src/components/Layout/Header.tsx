import React from "react";
import styles from "./Layout.module.css";
import { Button, PageHeader } from "antd";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { EditOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";

interface IHeader {}

const Header: React.FC<IHeader> = () => {
  const { uid, signIn, signOut } = React.useContext(AuthContext);
  return (
    <div className={styles.header}>
      <PageHeader
        title={
          <Link to={"/"}>
            <span className={styles.rainbow}>Påskejakten</span>
          </Link>
        }
        avatar={{ src: logo, shape: "square" }}
        extra={
          uid ? (
            <>
              <Link to={"/administrer"}>
                <Button icon={<EditOutlined />}>Mine påskejakter</Button>
              </Link>
              <Button icon={<LogoutOutlined />} onClick={signOut}>
                Logg ut
              </Button>
            </>
          ) : (
            <Button icon={<LoginOutlined />} onClick={signIn}>
              Administrer påskejakt
            </Button>
          )
        }
      />
    </div>
  );
};

export default Header;
