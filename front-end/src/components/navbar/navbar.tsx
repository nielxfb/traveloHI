import SearchBar from "./search-bar";
import styled, { useTheme } from "styled-components";
import { useAuth } from "../../providers/auth-context-provider";
import Button from "../button";
import { CiLight, CiDark } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useCurrency } from "../../providers/currency-context-provider";
import { CgProfile } from "react-icons/cg";
import { ADMIN_MENU, PUBLIC_MENU, USER_MENU } from "../../settings/menu-items";
import MenuItem from "./menu-item";
import { useEffect, useState } from "react";
import { ICreditCard } from "../../interfaces/credit-card-interface";
import { useJwt } from "../../hooks/use-jwt";
import { get } from "../../tools/api";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase/config";
import Select from "../form/select";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => props.theme.shadow};
`;

const NavbarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0.5rem 2rem;
  gap: 2rem;
`;

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: left;
  padding-left: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: ${(props) => props.theme.fontDimmed};
`;

const Theme = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.secondary};
  &:hover {
    background-color: ${(props) => props.theme.accent};
    transition: 0.3s ease-in-out;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Currency = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.secondary};
  img {
    max-width: 2vw;
    max-height: 2vh;
  }
  &:hover {
    background-color: ${(props) => props.theme.accent};
    transition: 0.3s ease-in-out;
  }
`;

const Profile = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.secondary};
  img {
    max-width: 20px;
    max-height: 20px;
  }
  &:hover {
    background-color: ${(props) => props.theme.accent};
    transition: 0.3s ease-in-out;
  }
`;

const Methods = styled(Select)`
  background-color: ${(props) => props.theme.secondary};
  color: white;
  border: none;
`;

interface Response {
  HotelTicketsCount: number;
  FlightTicketsCount: number;
}

export default function Navbar() {
  const { sub } = useJwt();
  const { displayCurrency } = useCurrency();
  const auth = useAuth();
  const theme = useTheme();
  const currency = useCurrency();
  const [cards, setCards] = useState<ICreditCard[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [response, setResponse] = useState<Response>({} as Response);

  const fetchCreditCards = async () => {
    if (!auth.isLoggedIn) {
      return;
    }
    const { sub } = useJwt();
    const url = import.meta.env.VITE_API_URL + "/api/fetch-credit-cards/" + sub;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setCards(response as ICreditCard[]);
  };

  const fetchUserWallet = async () => {
    if (!auth.isLoggedIn) {
      return;
    }
    const { sub } = useJwt();
    const url =
      import.meta.env.VITE_API_URL + "/api/fetch-wallet-balance/" + sub;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setBalance(response);
  };

  const fetchOngoingCount = async () => {
    if (!auth.isLoggedIn) {
      return;
    }
    const url =
      import.meta.env.VITE_API_URL + "/api/fetch-ongoing-tickets-count/" + sub;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }
    setResponse(response as Response);
  };

  useEffect(() => {
    fetchCreditCards();

    const unsubscribe = onSnapshot(collection(firestore, "banks"), () => {
      fetchCreditCards();
    });

    return () => unsubscribe();
  }, [sub]);

  useEffect(() => {
    fetchUserWallet();

    const unsubscribe = onSnapshot(collection(firestore, "wallets"), () => {
      fetchUserWallet();
    });

    return () => unsubscribe();
  }, [sub]);

  useEffect(() => {
    fetchOngoingCount();

    const unsubscribe = onSnapshot(collection(firestore, "carts"), () => {
      fetchOngoingCount();
    });

    return () => unsubscribe();
  }, [sub]);

  return (
    <Wrapper>
      <NavbarWrapper>
        <Title>
          <Link to="/">TraveloHI</Link>
        </Title>
        <SearchBar />
        {auth.user && (
          <Methods>
            <option>HIWallet: {displayCurrency(balance)}</option>
            {cards &&
              cards.map((card, index) => (
                <option key={index}>
                  {card.CardNumber} - {card.BankName}
                </option>
              ))}
          </Methods>
        )}
        {auth.user && response && (
          <Methods>
            <option>Flights: {response.FlightTicketsCount > 0 ? response.FlightTicketsCount : 0}</option>
            <option>Hotels: {response.HotelTicketsCount > 0 ? response.HotelTicketsCount : 0}</option>
          </Methods>
        )}
        <Theme onClick={theme.toggleTheme}>
          {theme.currentTheme == "light" ? (
            <>
              <CiLight />
              Switch to Dark
            </>
          ) : (
            <>
              <CiDark />
              Switch to Light
            </>
          )}
        </Theme>
        <Currency onClick={currency.toggleCurrency}>
          {currency.currency == "USD" ? (
            <>
              <img src="/united-states.png" alt="indonesia-flag" />
              Switch to IDR
            </>
          ) : (
            <>
              <img src="/indonesia.png" alt="united-states-flag" />
              Switch to USD
            </>
          )}
        </Currency>
        {auth.isLoggedIn ? (
          <>
            <Profile to="/profile">
              <CgProfile />
              {`${auth.user?.FirstName} ${auth.user?.LastName}`}
            </Profile>
            <Button onClick={auth.logout}>Log out</Button>
          </>
        ) : (
          <Buttons>
            <Link to="/auth/login">Login</Link>
            <Link to="/auth/register">Register</Link>
          </Buttons>
        )}
      </NavbarWrapper>
      <MenuWrapper>
        {auth.user?.Role == "admin" &&
          ADMIN_MENU.map((item, index) => (
            <MenuItem key={index} to={item.path}>
              {item.name}
            </MenuItem>
          ))}
        {auth.user?.Role == "user" &&
          USER_MENU.map((item, index) => (
            <MenuItem key={index} to={item.path}>
              {item.name}
            </MenuItem>
          ))}
        {PUBLIC_MENU.map((item, index) => (
          <MenuItem key={index} to={item.path}>
            {item.name}
          </MenuItem>
        ))}
      </MenuWrapper>
    </Wrapper>
  );
}
