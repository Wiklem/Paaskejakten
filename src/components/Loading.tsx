import React from "react";
import { Spin } from "antd";
const Loading = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Spin size="large" />
    </div>
  );
};

export default Loading;
