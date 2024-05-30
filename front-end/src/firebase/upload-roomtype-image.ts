import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";

async function UploadRoomTypeImage(file: File, fileName: string, hotelID: string): Promise<string> {
  const imageRef = ref(storage, `room-type-images/${hotelID}/${fileName}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

export default UploadRoomTypeImage;
