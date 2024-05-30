import { Link, useParams } from "react-router-dom";
import NavbarLayout from "../layouts/navbar-layout";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { get, post } from "../tools/api";
import styled from "styled-components";
import Vertical from "../components/form/vertical";
import Horizontal from "../components/form/horizontal";
import Input from "../components/form/input";
import Button from "../components/button";
import { useJwt } from "../hooks/use-jwt";
import { useCurrency } from "../providers/currency-context-provider";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";

interface ReservedSeat {
  SeatID: string;
  FlightID: string;
  SeatNumber: number;
}

interface Response {
  FlightID: string;
  Price: number;
  AirlineCode: string;
  AirlineNumber: string;
  DestinationAirportCode: string;
  DestinationAirport: string;
  OriginAirportCode: string;
  OriginAirport: string;
  DepartureTime: Date;
  ArrivalTime: Date;
  SeatTotal: number;
  AirlineImage: string;
  ReservedSeats: ReservedSeat[];
}

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.fontDimmed};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  box-shadow: ${(props) => props.theme.shadow};

  img {
    max-width: 45%;
    height: auto;
    object-fit: contain;
    border-radius: 0.5rem;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 2rem;
  align-items: left;
  justify-content: flex-start;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  gap: 1rem;
`;

const SeatContainer = styled.div`
  width: 35%;
  background-color: ${(props) => props.theme.accent};
  border-radius: 0.5rem;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
`;

const Seat = styled.div`
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: ${(props) => props.theme.secondary};
    color: ${(props) => props.theme.background};
    transition: 0.3s ease-in-out;
  }
`;

function FlightDetailPage() {
  const { id } = useParams();
  const { sub } = useJwt();
  const { displayCurrency } = useCurrency();
  const [flight, setFlight] = useState<Response>({} as Response);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [maxSeat, setMaxSeat] = useState<number>(0);

  const luggageRef = useRef<HTMLInputElement>(null);

  const fetchFlight = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/fetch-flight/" + id;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    if (response == undefined) {
      alert("response empty");
      return;
    }

    setFlight(response as Response);
  };

  useEffect(() => {
    fetchFlight();

    const unsubscribe = onSnapshot(collection(firestore, "flights"), () => {
      fetchFlight();
    });

    return () => unsubscribe();
  }, []);

  const handleSeatClick = (e: MouseEvent<HTMLDivElement>) => {
    const number = parseInt(e.currentTarget.innerHTML);

    if (selectedSeats.includes(number)) {
      setSelectedSeats((prev) => prev.filter((seat) => seat !== number));
      e.currentTarget.style.backgroundColor = "white";
      return;
    }

    if (selectedSeats.length >= maxSeat) {
      return;
    }

    setSelectedSeats((prev) => [...prev, number]);
    e.currentTarget.style.backgroundColor = "green";
  };

  const renderSeats = () => {
    const seats = [];
    const reservedSeat = flight.ReservedSeats
      ? flight.ReservedSeats.map((seat) => seat.SeatNumber)
      : null;
    for (let i = 0; i < flight.SeatTotal; i++) {
      if (reservedSeat && reservedSeat.includes(i + 1)) {
        seats.push(
          <Seat
            key={i}
            style={{
              backgroundColor: "red",
              color: "white",
              cursor: "not-allowed",
            }}
            onClick={handleSeatClick}
          >
            {i + 1}
          </Seat>
        );
      } else {
        seats.push(
          <Seat key={i} onClick={handleSeatClick}>
            {i + 1}
          </Seat>
        );
      }
    }
    return seats;
  };

  const handleAddToCart = async () => {
    const data = {
      UserID: sub,
      FlightID: id,
      Seats: selectedSeats,
      UseLuggage: luggageRef.current?.checked,
    };
    const url = import.meta.env.VITE_API_URL + "/api/add-to-flight-cart";
    try {
      await post(url, data);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    alert("Successfully added to cart");
  };

  return (
    <NavbarLayout>
      <Wrapper>
        <Container>
          <img src={flight.AirlineImage} />
          <Content>
            <Link to="/flights">&lt;&emsp;Back to flights</Link>
            <Vertical>
              <h1>
                {flight.AirlineCode}
                {flight.AirlineNumber}
              </h1>
              <h2>
                {flight.OriginAirportCode} — {flight.DestinationAirportCode}
              </h2>
              <h3>
                {flight.OriginAirport} — {flight.DestinationAirport}
              </h3>
              <h2>
                {new Date(flight.DepartureTime).toUTCString()} —{" "}
                {new Date(flight.ArrivalTime).toUTCString()}
              </h2>
              <h2>Price: {displayCurrency(flight.Price ? flight.Price : 0)}</h2>
              <h2>
                Duration:{" "}
                {(
                  (new Date(flight.ArrivalTime).getTime() -
                    new Date(flight.DepartureTime).getTime()) /
                  3600000
                ).toFixed(2)}{" "}
                hour(s)
              </h2>
              <h1>Total Price: {displayCurrency(flight.Price * selectedSeats.length)}</h1>
            </Vertical>
          </Content>
        </Container>
        <Horizontal
          style={{
            justifyContent: "left",
            alignItems: "flex-start",
            gap: "4rem",
          }}
        >
          <SeatContainer>{renderSeats()}</SeatContainer>
          <Vertical style={{ width: "30%" }}>
            <label>Select seat quantity: </label>
            <Input
              type="number"
              onChange={(e) => setMaxSeat(parseInt(e.target.value))}
              value={maxSeat}
            />
            <Horizontal>
              <label>Add 20 kg luggage</label>
              <Input type="checkbox" ref={luggageRef} />
            </Horizontal>
            <Vertical>
              <Button type="button" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button type="button">Buy Now</Button>
            </Vertical>
          </Vertical>
        </Horizontal>
      </Wrapper>
    </NavbarLayout>
  );
}

export default FlightDetailPage;
