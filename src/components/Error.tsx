import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <Result
      style={{ backgroundColor: "white" }}
      title="Det skjedde en feil"
      extra={[
        <Button onClick={() => window.location.reload()} type="primary">
          Prøv igjen
        </Button>,
        <Link to={"/"}>
          <Button type="primary">Hjem</Button>
        </Link>,
      ]}
    />
  );
};

export default Error;
