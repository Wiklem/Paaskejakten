import React from "react";
import styles from "./Layout.module.css";
import { Button, PageHeader } from "antd";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { EditOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useHistory } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  let history = useHistory();
  const { uid, signOut } = React.useContext(AuthContext);

  if (location.pathname.includes("/jakt/")) return null;
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
              <Button
                icon={<LogoutOutlined />}
                onClick={() => {
                  signOut();
                  history.push("/");
                }}
              >
                Logg ut
              </Button>
            </>
          ) : (
            <Link to={"/login"}>
              <Button icon={<LoginOutlined />}>Logg inn/opprett jakt</Button>
            </Link>
          )
        }
      />
    </div>
  );
};

export default Header;
