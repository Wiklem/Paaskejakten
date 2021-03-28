import { db } from "./firebase/firebase";

const getUserHunts = async (id: string) => {
  const huntRef = db.collection("hunts");
  return await huntRef.where("owner", "==", id).get();
};

const getHunt = (huntId: string) => {
  return db
    .collection("hunts")
    .doc(huntId)
    .get()
    .then((hunt) => {
      return {
        huntId: hunt.id,
        ...hunt.data(),
      };
    });
};

const getHunts = (uid: string) => {
  return getUserHunts(uid).then((data) => {
    return data.docs.map((doc) => {
      return { huntId: doc.id, ...doc.data() };
    });
  });
};

const getHuntTasks = async (huntId: string) => {
  const huntRef = db.collection("tasks");
  return await huntRef.where("huntId", "==", huntId).get();
};

const getTasks = (huntId: string) => {
  return getHuntTasks(huntId).then((data) => {
    return data.docs
      .sort((a, b) => a.data().date - b.data().date)
      .map((doc, key) => {
        return {
          taskId: doc.id,
          number: key + 1,
          ...doc.data(),
        };
      });
  });
};

const GetData = {
  getTasks,
  getHunts,
  getHunt,
};

export default GetData;
