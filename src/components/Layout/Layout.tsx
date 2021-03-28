import React from "react";
import Landingpage from "../../routes/Landingpage";
import styles from "./Layout.module.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthProvider from "../../context/AuthContext";
import Header from "./Header";
import Manager from "../../routes/Manager";
import Hunt from "../../routes/Hunt";
import EasterContextProvider from "../../context/EasterContext";
import Help from "../../routes/Help";
import { Col, Row } from "antd";

interface ILayout {}

const Layout: React.FC<ILayout> = () => {
  return (
    <AuthProvider>
      <Router>
        <div className={styles.layout}>
          <Header />
          <Row>
            <Col xs={1} md={2} xl={4} />
            <Col xs={22} md={20} xl={16}>
              <div className={styles.container}>
                <Switch>
                  <Route path={"/administrer/:id"}>
                    <EasterContextProvider>
                      <Manager />
                    </EasterContextProvider>
                  </Route>
                  <Route path={"/administrer"}>
                    <EasterContextProvider>
                      <Manager />
                    </EasterContextProvider>
                  </Route>
                  <Route path={"/jakt/:id"}>
                    <EasterContextProvider>
                      <Hunt />
                    </EasterContextProvider>
                  </Route>
                  <Route path={"/hjelp"}>
                    <Help />
                  </Route>
                  <Route path={"/"}>
                    <Landingpage />
                  </Route>
                </Switch>
              </div>
            </Col>
            <Col xs={1} md={2} xl={4} />
          </Row>
          <div className={styles.footer}>
            Påskejakten.no - Copyright © Wiklem.no. All Rights Reserved
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default Layout;
