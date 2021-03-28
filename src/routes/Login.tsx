import * as React from "react";
import { Card, Button } from "antd";
import { FacebookFilled, GoogleSquareFilled } from "@ant-design/icons";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

interface ILogin {}

const Login: React.FC<ILogin> = () => {
  const { signIn, uid } = React.useContext(AuthContext);
  let history = useHistory();
  React.useEffect(() => {
    if (uid) {
      history.push("/administrer");
    }
  }, [uid, history]);

  return (
    <Card
      title="Logg inn for å administrer påskejakter."
      actions={[
        <Button
          type="primary"
          icon={<FacebookFilled />}
          onClick={() => signIn("FACEBOOK")}
        >
          Facebook login
        </Button>,

        <Button
          type="primary"
          icon={<GoogleSquareFilled />}
          onClick={() => signIn("GOOGLE")}
        >
          Google login
        </Button>,
      ]}
    >
      <p>
        Du kan opprette og administrere påskejakter ved å logge inn via facebook
        eller google kontoen din.
      </p>
    </Card>
  );
};

export default Login;
