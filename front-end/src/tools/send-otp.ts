import { post } from "./api";

export const sendOTP = async (email: string) => {
    const url = import.meta.env.VITE_API_URL + "/api/send-otp";
    try {
        await post(url, { Email: email });
    } catch (error: any) {
        throw new Error(error.message);
    }
}