import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";

async function UploadAirlineImage(
  file: File,
  fileName: string
): Promise<string> {
  const photoRef = ref(storage, `airline-images/${fileName}`);
  await uploadBytes(photoRef, file);
  return await getDownloadURL(photoRef);
}

export default UploadAirlineImage;
