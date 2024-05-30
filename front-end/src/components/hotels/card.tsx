import styled from "styled-components";
import { HotelResponse } from "../../pages/hotels-page";
import { Link } from "react-router-dom";

const Wrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  background-color: ${(props) => props.theme.background};
  box-shadow: ${(props) => props.theme.shadow};
  width: 20vw;
  border-radius: 0.5rem;

  img {
    border-radius: 0.5rem 0.5rem 0 0;
    width: 100%;
    height: 20vw;
    object-fit: cover;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  h3 {
    font-size: 1.5rem;
  }
  p {
    font-size: 1rem;
    color: ${(props) => props.theme.fontDimmed};
  }
`;

interface CardProps {
  hotel: HotelResponse;
}

function Card({ hotel }: CardProps) {
  return (
    <Wrapper to={`/hotels/${hotel.HotelID}`}>
      <img src={hotel.ImageLink} alt={`${hotel.HotelName} Image`} />
      <TextContainer>
        <h3>{hotel.HotelName}</h3>
        <p>
          {hotel.CityName}, {hotel.CountryName}
        </p>
      </TextContainer>
    </Wrapper>
  );
}

export default Card;
