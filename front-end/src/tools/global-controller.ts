import { useJwt } from "../hooks/use-jwt";
import { post } from "./api";
import { ICreditCard } from "../interfaces/credit-card-interface";

export const fetchCreditCards = async () => {
  const { sub } = useJwt();
  const url = import.meta.env.VITE_API_URL + "/api/fetch-credit-cards";
  let response;
  try {
    response = await post(url, { UserID: sub });
  } catch (error: any) {
    throw new Error(error);
  }

  if (response == undefined) {
    throw new Error("Failed to retrieve credit cards.");
  }

  return response as ICreditCard[];
};
