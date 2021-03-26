import * as React from "react";
import { List, Button, Skeleton, Result } from "antd";
import { AuthContext } from "../../context/AuthContext";
import { functionUrl } from "../../utils/api";
import axios from "axios";
import Loading from "../../components/Loading";
import NewHunt from "./NewHunt";
import { IHunt } from "../../utils/types";
import EditHunt from "./EditHunt";

const Manager: React.FC = () => {
  const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [id, setId] = React.useState<string>();
  const [hunts, setHunts] = React.useState<Array<IHunt>>();
  const [edit, setEdit] = React.useState<IHunt>();
  const [reload, setReload] = React.useState(Date.now());
  const [error, setError] = React.useState<boolean>();

  React.useEffect(() => {
    if (!id) {
      if (user && user.email) {
        axios
          .post(functionUrl + "getUser", { user: user.email })
          .then((res) => {
            setId(res.data.id);
            setLoading(false);
          });
      } else {
        setError(true);
      }
    } else {
      setError(false);
      setLoading(true);
      axios.post(functionUrl + "getHunts", { id }).then((res) => {
        setHunts(res.data);
        setLoading(false);
      });
    }
  }, [id, user && user.email, reload]);

  if (loading) return <Loading />;

  if (error)
    return (
      <Result
        style={{ backgroundColor: "white" }}
        status="403"
        subTitle="Du må logge inn for å administrere påskejakter."
      />
    );

  if (!id) return <div>Du er ikke logget inn!</div>;

  if (edit)
    return (
      <EditHunt
        hunt={edit}
        back={() => {
          setEdit(undefined);
          setReload(Date.now());
        }}
      />
    );
  return (
    <>
      <strong>Dine påskejakter </strong>

      <br />
      <List
        style={{ width: " 400px" }}
        size="large"
        bordered
        dataSource={hunts}
        renderItem={(item) => (
          <List.Item
            style={{ backgroundColor: "white" }}
            actions={[
              <Button key="list-loadmore-edit" onClick={() => setEdit(item)}>
                Endre
              </Button>,
              // <a key="list-loadmore-more">Aktiver</a>,
            ]}
          >
            <Skeleton avatar title={false} loading={false} active>
              <List.Item.Meta
                title={item.name}
                description={"Spillkode: " + item.huntId}
                // avatar={
                //   item.ready ? (
                //     <CheckCircleTwoTone twoToneColor="#52c41a" />
                //   ) : (
                //     <WarningTwoTone twoToneColor={"orange"} />
                //   )
                // }L
              />
            </Skeleton>
          </List.Item>
        )}
      />
      <NewHunt id={id} reload={() => setReload(Date.now())} />
    </>
  );
};

export default Manager;
