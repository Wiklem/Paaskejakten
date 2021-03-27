import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { customAlphabet } from "nanoid";

admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
const cors = require("cors")({ origin: true });

const createId = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);

const checkId = async (id: string) => {
  const hunt = db.collection("hunts").doc(id);
  const inUse = await hunt.get();
  return inUse.exists;
};

/**
 * Generer id
 * @param test
 */
// @ts-ignore
const getHuntId = async (test?: string) => {
  const id = test || createId();
  const inUse = await checkId(id);
  if (inUse) {
    return getHuntId();
  }
  return id;
};

/**
 * Get amount of hunts for user
 * @param id
 */
const getUserHunts = async (id: string) => {
  const huntRef = db.collection("hunts");
  return await huntRef.where("owner", "==", id).get();
};

const getHuntTasks = async (huntId: string) => {
  const huntRef = db.collection("tasks");
  return await huntRef.where("huntId", "==", huntId).get();
};

export const newHunt = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const amount = await getUserHunts(req.body.id);
    if (amount.size >= 5) {
      res.status(403).send({
        message:
          "Du har for mange påskejakter, slett en for å opprette en ny hvis du ikke vil redigere de eksisterende påskejaktene.",
      });
    } else {
      const huntId = await getHuntId();
      await db.collection("hunts").doc(huntId).set({
        owner: req.body.id,
        date: new Date(),
        name: req.body.name,
        finishTitle: "Gratulerer!",
        finishText: "Du har fullført årets påskejakt :)",
      });
      res.status(200).send("ok");
    }
  });
});

export const getHunts = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (!req.body.uid)
      res.status(403).send("Du må logge inn for å administrere påskejakter.");
    getUserHunts(req.body.uid).then(async (data) => {
      const huntArray = await data.docs.map((doc) => {
        return { huntId: doc.id, ...doc.data() };
      });
      res.status(200).send(huntArray);
    });
  });
});

export const getHunt = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    db.collection("hunts")
      .doc(req.body.huntId)
      .get()
      .then((hunt) =>
        res.status(200).send({
          huntId: hunt.id,
          ...hunt.data(),
        })
      );
  });
});

export const updateHunt = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const huntId = req.body.huntId;
    if (!huntId) res.status(404).send(404);
    await db
      .collection("hunts")
      .doc(huntId)
      .set(
        {
          activeDate: req.body.activeDate || null,
          name: req.body.name,
        },
        { merge: true }
      );
    res.status(200).send("ok");
  });
});

export const deleteHunt = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const huntId = req.body.huntId;
    if (!huntId) res.status(404).send(404);
    await getHuntTasks(huntId)
      .then((tasks) => tasks.forEach((task) => task.ref.delete()))
      .finally(() =>
        db
          .collection("hunts")
          .doc(huntId)
          .delete()
          .then(() => res.status(200).send("ok"))
      );
  });
});

export const getTasks = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (!req.body.huntId) res.status(404).send("Ingen huntId.");
    getHuntTasks(req.body.huntId).then(async (data) => {
      const taskArray = await data.docs
        .sort((a, b) => a.data().date - b.data().date)
        .map((doc, key) => {
          return { taskId: doc.id, number: key + 1, ...doc.data() };
        });
      res.status(200).send(taskArray);
    });
  });
});

export const newTask = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const taskId = createId();
    await db.collection("tasks").doc(taskId).set({
      huntId: req.body.huntId,
      date: new Date(),
    });
    res.status(200).send("ok");
  });
});

export const updateTask = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    await db
      .collection("tasks")
      .doc(req.body.taskId)
      .set({
        ...req.body,
      });
    res.status(200).send("ok");
  });
});

export const deleteTask = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (!req.body.taskId) res.status(404).send("Ingen taskId.");
    await db
      .collection("tasks")
      .doc(req.body.taskId)
      .delete()
      .then(() => res.status(200).send("ok"));
  });
});
