import styled from "styled-components";
import ProfileSidebarLayout from "../layouts/profile-sidebar-layout";
import { useEffect, useState } from "react";
import Error from "../components/form/errors";
import { useJwt } from "../hooks/use-jwt";
import { get } from "../tools/api";
import { ICreditCard } from "../interfaces/credit-card-interface";
import Card from "../components/credit-card/card";
import { Link, Outlet } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  min-height: calc(100vh - 100px);
  height: fit-content;
`;

const StyledLink = styled(Link)`
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.font};
`;

function CreditCardsPage() {
  const [error, setError] = useState<string>("");
  const [cards, setCards] = useState<ICreditCard[]>([]);

  const fetchCreditCards = async () => {
    const { sub } = useJwt();
    const url = import.meta.env.VITE_API_URL + "/api/fetch-credit-cards/" + sub;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    if (response == undefined) {
      setError("There are no credit cards yet.");
      return;
    }

    setError("");
    setCards(response as ICreditCard[]);
  };

  useEffect(() => {
    fetchCreditCards();

    const unsubscribe = onSnapshot(collection(firestore, "banks"), () => {
      fetchCreditCards();
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProfileSidebarLayout>
      <StyledLink to="/credit-cards/add-credit-card">
        Add Credit Card
      </StyledLink>
      <Error error={error} />
      <Wrapper>
        {cards &&
          cards.map((card, index) => (
            <div key={index}>
              <Card card={card} />
            </div>
          ))}
        <Outlet />
      </Wrapper>
    </ProfileSidebarLayout>
  );
}

export default CreditCardsPage;
