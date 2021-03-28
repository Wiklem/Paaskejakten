import { storage } from "./firebase/firebase";

const uploadImage = async (huntId: string, taskId: string, file: any) => {
  const metadata = {
    contentType: file.type,
  };
  let extension = ".jpg";
  if (file.type === "image/png") extension = ".png";
  const imgFile = storage.child(`hunts/${huntId}/${taskId}${extension}`);
  return imgFile.put(file, metadata);
};

const Storage = {
  uploadImage,
};

export default Storage;
