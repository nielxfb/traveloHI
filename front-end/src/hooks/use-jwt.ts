import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string;
  exp: number;
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  DOB: Date;
  Address: string;
  Gender: string;
  Role: string;
  ProfilePictureLink: string;
  IsBanned: boolean;
  LoggedIn: boolean;
  Subscribe: boolean;
  isValid: boolean;
}

export const useJwt = (token?: string) => {
  let tkn;

  if (typeof token == "undefined") {
    tkn = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);
  } else {
    tkn = token;
  }

  if (tkn == null || tkn == "") {
    return <DecodedToken>{ isValid: false }
  }

  const decoded = jwtDecode(tkn);

  const { sub, exp } = <DecodedToken>(decoded);

  const isExpired = getTimestampInSeconds() >= exp;
  const isValid = !isExpired && sub !== "";

  return <DecodedToken>{ sub, isValid }
};

const getTimestampInSeconds = () => {
    return Math.floor(Date.now() / 1000);
}
