import React from "react";
import EasterContextProvider from "../EasterContext";
import Landingpage from "../../containers/Landingpage";
import styles from "./Layout.module.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
interface ILayout {}

const Layout: React.FC<ILayout> = () => {
  return (
    <Router>
      <div className={styles.layout}>
        <EasterContextProvider>
          {!localStorage.getItem("step") && (
            <div className={styles.header}>
              <h1 className={styles.rainbowText}>Påskejakten</h1>
            </div>
          )}
          <div className={styles.container}>
            <Switch>
              <Route
                path="/dev"
                render={(props) => <Landingpage {...props} dev={true} />}
              />
              <Route path={"/"}>
                <Landingpage />
              </Route>
            </Switch>
          </div>
        </EasterContextProvider>
      </div>
    </Router>
  );
};

export default Layout;
