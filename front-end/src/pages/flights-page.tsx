import { useEffect, useState } from "react";
import NavbarLayout from "../layouts/navbar-layout";
import { IFlight } from "../interfaces/flight-interface";
import { get } from "../tools/api";
import styled from "styled-components";
import Vertical from "../components/form/vertical";
import { Link } from "react-router-dom";
import { useCurrency } from "../providers/currency-context-provider";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";

const Wrapper = styled(Link)`
  background-color: ${(props) => props.theme.background};
  padding: 2rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;

function FlightsPage() {
  const { displayCurrency } = useCurrency();
  const [flights, setFlights] = useState<IFlight[]>([]);

  const fetchFlights = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/fetch-flights";
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

    setFlights(response as IFlight[]);
  };

  useEffect(() => {
    fetchFlights();

    const unsubscribe = onSnapshot(collection(firestore, "flights"), () => {
      fetchFlights();
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavbarLayout>
      {flights &&
        flights.map((flight, index) => (
          <Wrapper key={index} to={`/flight-detail/${flight.FlightID}`}>
            <Vertical>
              <h1>
                {flight.AirlineCode}
                {flight.AirlineNumber}
              </h1>
              <h2>
                {flight.OriginAirportCode} - {flight.DestinationAirportCode}
              </h2>
              <h2>
                {new Date(flight.DepartureTime).toUTCString()} -{" "}
                {new Date(flight.ArrivalTime).toUTCString()}
              </h2>
              <h2>Price: {displayCurrency(flight.Price ? flight.Price : 0)}</h2>
            </Vertical>
          </Wrapper>
        ))}
    </NavbarLayout>
  );
}

export default FlightsPage;
