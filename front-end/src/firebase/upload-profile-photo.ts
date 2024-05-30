import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";

async function UploadProfilePhoto(
  file: File,
  fileName: string
): Promise<string> {
  const photoRef = ref(storage, `profile-photos/${fileName}`);
  await uploadBytes(photoRef, file);
  return await getDownloadURL(photoRef);
}

export default UploadProfilePhoto;
