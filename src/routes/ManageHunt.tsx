import * as React from "react";
import { List, Button, Skeleton, Result, message } from "antd";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";
import NewHunt from "../components/Manager/NewHunt";
import { IHunt } from "../utils/types";
import HuntEditor from "../components/Manager/HuntEditor";
import { ShareAltOutlined } from "@ant-design/icons";
import GetData from "../api/getData";

const ManageHunt: React.FC = () => {
  const [edit, setEdit] = React.useState<IHunt>();
  const { uid } = React.useContext(AuthContext);

  const [data, setData] = React.useState<Array<IHunt>>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(Date.now());
  const reload = () => setReloadKey(Date.now);

  React.useEffect(() => {
    if (uid) {
      GetData.getHunts(uid)
        .then((data: any) => setData(data))
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [uid, reloadKey]);

  if (loading) return <Loading />;
  if (error)
    return (
      <Result
        style={{ backgroundColor: "white" }}
        status="403"
        subTitle={"Du må logge inn for å administrere påskejakter."}
      />
    );
  if (edit)
    return (
      <HuntEditor
        hunt={edit}
        back={() => {
          setEdit(undefined);
          reload();
        }}
      />
    );
  return (
    <>
      {uid && <NewHunt id={uid} reload={() => reload()} />}
      <br />
      <List
        style={{ width: " 400px" }}
        size="large"
        bordered
        dataSource={data}
        renderItem={(item: IHunt) => (
          <List.Item
            style={{ backgroundColor: "white" }}
            actions={[
              <Button key="list-loadmore-edit" onClick={() => setEdit(item)}>
                Endre
              </Button>,
            ]}
          >
            <Skeleton avatar title={false} loading={false} active>
              <List.Item.Meta
                title={item.name}
                description={"Spillkode: " + item.huntId}
                avatar={
                  <ShareAltOutlined
                    onClick={() => {
                      message.success("Lenke til jakt kopiert");
                      navigator.clipboard.writeText(
                        "https://påskejakten.no/jakt/" + item.huntId
                      );
                    }}
                  />
                }
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  );
};

export default ManageHunt;
