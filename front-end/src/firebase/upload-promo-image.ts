import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";

async function UploadPromoImage(file: File, fileName: string): Promise<string> {
  const imageRef = ref(storage, `promo-images/${fileName}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

export default UploadPromoImage;
