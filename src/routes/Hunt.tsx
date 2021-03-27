import React from "react";
import { useParams, Link } from "react-router-dom";
import { apiStates, useApi } from "../utils/api";
import { Result, Button, Card, PageHeader } from "antd";
import { IHunt } from "../utils/types";
import Countdown from "../components/Countdown";
import Loading from "../components/Loading";
import Tasks from "../components/EasterHunt/Tasks";

interface Param {
  id: string;
}

const Hunt: React.FC = () => {
  const { id } = useParams<Param>();
  const [ready, setReady] = React.useState(false);

  const { process } = useApi("getHunt", {
    huntId: id.toLowerCase(),
  });

  const renderComponent = (data: IHunt) => {
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
  const renderProcess = (process: any) => {
    switch (process.state) {
      case apiStates.LOADING:
        return <Loading />;
      case apiStates.ERROR:
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
      case apiStates.SUCCESS:
        return renderComponent(process.data);
      default:
        return <Loading />;
    }
  };

  return renderProcess(process);
};

export default Hunt;
