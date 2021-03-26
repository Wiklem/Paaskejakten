export const functionUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/paaskejakten/us-central1/"
    : "https://us-central1-wiklem-8a13e.cloudfunctions.net/";
