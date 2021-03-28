import { db } from "./firebase/firebase";
import { customAlphabet } from "nanoid";
import { IHunt, ITask } from "../utils/types";
import GetData from "./getData";
import moment from "moment";

const createHuntId = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);
const createTaskId = customAlphabet("abcdefghijklmnopqrstuvwxyz", 12);

const checkId = async (id: string) => {
  const hunt = db.collection("hunts").doc(id);
  const inUse = await hunt.get();
  return inUse.exists;
};

// @ts-ignore
const getHuntId = async () => {
  const id = createHuntId();
  const inUse = await checkId(id);
  if (inUse) {
    return getHuntId();
  }
  return id;
};

const newHunt = async (uid: string, name: string) => {
  const huntId = await getHuntId();
  await db.collection("hunts").doc(huntId).set({
    owner: uid,
    date: moment().toJSON(),
    name: name,
    finishTitle: "Gratulerer!",
    finishText: "Du har fullført årets påskejakt :)",
  });
};

const updateHunt = (huntId: string, data: IHunt) => {
  return db.collection("hunts").doc(huntId).set(data, { merge: true });
};

const deleteHunt = (huntId: string) =>
  GetData.getTasks(huntId)
    .then((tasks) => tasks.forEach((task: any) => task.ref.delete()))
    .finally(() => db.collection("hunts").doc(huntId).delete());

const newTask = (huntId: string) => {
  const taskId = createTaskId();
  return db.collection("tasks").doc(taskId).set({
    huntId: huntId,
    date: new Date(),
  });
};

const deleteTask = (taskId: string) =>
  db.collection("tasks").doc(taskId).delete();

const updateTask = (taskId: string, data: ITask) => {
  return db.collection("tasks").doc(taskId).set(data, { merge: true });
};

const sendMessage = (mail: string, message: string, email: string) => {
  return db.collection("meldinger").doc(mail).set({
    email,
    message,
  });
};

const WriteData = {
  newHunt,
  updateHunt,
  deleteHunt,
  deleteTask,
  newTask,
  updateTask,
  sendMessage,
};

export default WriteData;
