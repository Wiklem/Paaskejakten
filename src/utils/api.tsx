import * as React from "react";
import axios from "axios";

export const functionUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/paaskejakten/us-central1/"
    : "https://us-central1-paaskejakten.cloudfunctions.net/";

export const apiStates = {
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

export function useApi(path: string, opt?: any) {
  const [process, setProcess] = React.useState({
    state: apiStates.LOADING,
    error: "",
    data: [],
  });
  const [reloadKey, setReloadKey] = React.useState(Date.now());
  const setPartData = (partialData: any) =>
    setProcess({ ...process, ...partialData });

  React.useEffect(() => {
    axios({
      method: "post",
      url: functionUrl + path,
      data: {
        ...opt,
      },
    })
      .then((response) => {
        setPartData({
          state: apiStates.SUCCESS,
          data: response.data,
        });
      })
      .catch(() => {
        setPartData({
          state: apiStates.ERROR,
          error: "fetch failed",
        });
      });
  }, [reloadKey]);
  return { process, reload: () => setReloadKey(Date.now) };
}
