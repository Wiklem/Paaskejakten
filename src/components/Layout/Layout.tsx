import React from "react";
import Landingpage from "../../containers/Landingpage";
import styles from "./Layout.module.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthProvider from "../../context/AuthContext";
import Header from "./Header";
import Manager from "../../containers/Manager/Manager";
import Hunt from "../../containers/Hunt";
import EasterContextProvider from "../../context/EasterContext";

interface ILayout {}

const Layout: React.FC<ILayout> = () => {
  return (
    <AuthProvider>
      <Router>
        <div className={styles.layout}>
          <EasterContextProvider>
            <Header />
            <div className={styles.container}>
              <Switch>
                <Route path={"/administrer"}>
                  <Manager />
                </Route>
                <Route path={"/jakt/:id"}>
                  <Hunt />
                </Route>
                <Route path={"/"}>
                  <Landingpage />
                </Route>
              </Switch>
            </div>
          </EasterContextProvider>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default Layout;
