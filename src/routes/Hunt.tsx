import React from "react";
import { useParams, Link } from "react-router-dom";
import { Result, Button, Card, PageHeader } from "antd";
import { IHunt } from "../utils/types";
import Countdown from "../components/Countdown";
import Loading from "../components/Loading";
import Tasks from "../components/EasterHunt/Tasks";
import GetData from "../api/getData";

interface Param {
  id: string;
}

const Hunt: React.FC = () => {
  const { id } = useParams<Param>();
  const [ready, setReady] = React.useState(false);

  const [data, setData] = React.useState<IHunt>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      setLoading(true);
      GetData.getHunt(id.toLowerCase())
        .then((data: any) => setData(data))
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <Card>
        <Result
          status="404"
          title="404"
          subTitle="Fant ikke oppgaven med gitt id."
          extra={
            <Link to={"/"}>
              <Button type="primary">Tilbake</Button>
            </Link>
          }
        />
      </Card>
    );
  }

  if (!data) return null;
  return (
    <div>
      <PageHeader style={{ backgroundColor: "white" }} title={data.name} />
      <br />
      {data.activeDate ? (
        ready ? (
          <Tasks hunt={data} />
        ) : (
          <Countdown time={data.activeDate} readyCallback={setReady} />
        )
      ) : (
        <Tasks hunt={data} />
      )}
    </div>
  );
};

export default Hunt;
