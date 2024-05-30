import styled from "styled-components";
import { ICreditCard } from "../../interfaces/credit-card-interface";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.background};
  width: 500px;

  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

export interface CardProps {
  card: ICreditCard;
}

function Card({ card }: CardProps) {
  return (
    <Wrapper>
      <h1>Bank: {card.BankName}</h1>
      <h1>Card Number: {card.CardNumber}</h1>
      <h2>Expiry Date: {`${card.ExpiredMonth}/${card.ExpiredYear}`}</h2>
      <h2>CVV: {card.CVV}</h2>
    </Wrapper>
  );
}

export default Card;
