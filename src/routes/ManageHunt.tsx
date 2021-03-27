import * as React from "react";
import { List, Button, Skeleton, Result, message } from "antd";
import { AuthContext } from "../context/AuthContext";
import { apiStates, useApi } from "../utils/api";
import Loading from "../components/Loading";
import NewHunt from "../components/Manager/NewHunt";
import { IHunt } from "../utils/types";
import EditHunt from "../components/Manager/EditHunt";
import { ShareAltOutlined } from "@ant-design/icons";

const ManageHunt: React.FC = () => {
  const { uid } = React.useContext(AuthContext);
  const [edit, setEdit] = React.useState<IHunt>();
  const { process, reload } = useApi("getHunts", { uid });

  React.useEffect(() => {
    reload();
  }, [uid]);

  const renderComponent = (data: Array<IHunt>) => {
    if (edit)
      return (
        <EditHunt
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

  const renderProcess = (process: any) => {
    if (!uid) return <Loading />;
    switch (process.state) {
      case apiStates.LOADING:
        return <Loading />;
      case apiStates.ERROR:
        return (
          <Result
            style={{ backgroundColor: "white" }}
            status="403"
            subTitle={
              process.error || "Du må logge inn for å administrere påskejakter."
            }
          />
        );
      case apiStates.SUCCESS:
        return renderComponent(process.data);
      default:
        return <Loading />;
    }
  };

  return renderProcess(process);
};

export default ManageHunt;
