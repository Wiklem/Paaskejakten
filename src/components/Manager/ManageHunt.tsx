import * as React from "react";
import { Button, message, PageHeader, Tabs } from "antd";
import moment from "moment";
import { useHistory } from "react-router-dom";
import GetData from "../../api/getData";
import { IHunt } from "../../utils/types";
import Loading from "../Loading";
import Error from "../Error";
import HuntEditor from "./HuntEditor";
import ManageTasks from "./ManageTasks";
import { ShareAltOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
interface IManageHunt {
  huntId: string;
}

const ManageHunt: React.FC<IManageHunt> = ({ huntId }) => {
  let history = useHistory();

  const [data, setData] = React.useState<IHunt>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const [reloadKey, setReloadKey] = React.useState(Date.now());
  const reload = () => setReloadKey(Date.now);

  React.useEffect(() => {
    if (huntId) {
      GetData.getHunt(huntId)
        .then((data: any) => setData(data))
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [huntId, reloadKey]);

  if (loading) return <Loading />;
  if (error || !data) return <Error />;

  return (
    <div>
      <PageHeader
        style={{ backgroundColor: "white", paddingTop: 0 }}
        onBack={() => history.push("/administrer")}
        title={data.name}
        extra={[
          <>
            <br />
            <span>Opprettet: {moment(data.date).format("DD.MM.YYYY")}</span>
            <br />
            <span>
              Kode: <strong>{data.huntId}</strong>
            </span>
            <br />
          </>,
          <Button
            key="list-loadmore-edit"
            icon={<ShareAltOutlined />}
            onClick={() => {
              message.success("Lenke til jakt kopiert");
              navigator.clipboard.writeText(
                "https://påskejakten.no/jakt/" + huntId
              );
            }}
          >
            Kopier lenke til påskejakt
          </Button>,
        ]}
      />

      <Tabs
        defaultActiveKey="1"
        style={{ background: "white" }}
        type="card"
        centered
      >
        <TabPane tab="Endre Jakt" key="1">
          <HuntEditor hunt={data} reload={() => reload()} />
        </TabPane>
        <TabPane tab="Endre Oppgaver" key="2">
          <ManageTasks huntId={huntId} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ManageHunt;
