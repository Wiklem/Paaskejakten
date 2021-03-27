import * as React from "react";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const Help: React.FC = () => {
  return (
    <Tabs
      defaultActiveKey="1"
      style={{ backgroundColor: "white", padding: "20px" }}
    >
      <TabPane tab="Gjennomføre påskejakt" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Administrere påskejakt" key="2">
        Content of Tab Pane 2
      </TabPane>
    </Tabs>
  );
};

export default Help;
