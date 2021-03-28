import React from "react";
import { Form, Input, Button, Card } from "antd";
import { Link } from "react-router-dom";
import WriteData from "../api/writeData";
import Error from "../components/Error";
import { AuthContext } from "../context/AuthContext";

const { TextArea } = Input;
const Contact = () => {
  const { email, uid } = React.useContext(AuthContext);
  const [mail, setMail] = React.useState<string>("asd");
  const [message, setMessage] = React.useState<string>("");
  const [messageSent, setMessageSent] = React.useState(false);
  const [error, setError] = React.useState(false);

  const sendMessage = () => {
    WriteData.sendMessage(email || "ukjent", message, mail)
      .then(() => {
        setMessageSent(true);
      })
      .catch((e) => {
        setError(e);
      });
  };

  if (messageSent) return <Card>Melding sendt!</Card>;

  if (!uid)
    return (
      <Card>
        Du må logge inn for å sende en melding <br />
        <Link to={"/login"}> Gå til innlogging </Link>
      </Card>
    );

  return (
    <Form layout="vertical" onFinish={sendMessage}>
      {error && <Error />}

      <Form.Item
        label="E-post"
        name="mail"
        rules={[{ required: true, message: "Fyll inn din epost adresse" }]}
      >
        <Input value={mail} onChange={(e) => setMail(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Melding"
        name="Melding"
        rules={[{ required: true, message: "Melding på fylles inn." }]}
      >
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Send melding
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Contact;
