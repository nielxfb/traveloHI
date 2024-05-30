import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";

async function UploadHotelImage(file: File, fileName: string): Promise<string> {
  const imageRef = ref(storage, `hotel-images/${fileName}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

export default UploadHotelImage;
