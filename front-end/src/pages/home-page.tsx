import NavbarLayout from '../layouts/navbar-layout'
import PhotoSlider from '../components/photo-slider'
import styled from 'styled-components';
import Title from '../components/form/title';
import { useEffect, useState } from 'react';
import { get } from '../tools/api';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { IFlight } from '../interfaces/flight-interface';

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background-color: ${(props) => props.theme.background};
  padding: 2rem;
`;

const Content = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  width: 100%;
`;

interface HotelResponse {
  HotelID: string;
  HotelName: string;
  CityName: string;
  CountryName: string;
}

function HomePage() {
  const [error, setError] = useState<string>("");
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [flights, setFlights] = useState<IFlight[]>([]);

  const fetchFlights = async () => {
    let response;
    const url = import.meta.env.VITE_API_URL + "/api/fetch-flight-recommendations";
    try {
      response = await get(url);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    if (response == undefined) {
      setError("No response");
      return;
    }

    setError("");
    setFlights(response as IFlight[]);
  };

  const fetchHotels = async () => {
    let response;
    const url = import.meta.env.VITE_API_URL + "/api/fetch-hotel-recommendations";
    try {
      response = await get(url);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    if (response == undefined) {
      setError("No response");
      return;
    }

    setError("");
    setHotels(response as HotelResponse[]);
  };

  useEffect(() => {
    fetchHotels();

    const unsubscribe = onSnapshot(collection(firestore, "hotels"), () => {
      fetchHotels();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchFlights();

    const unsubscribe = onSnapshot(collection(firestore, "flights"), () => {
      fetchFlights();
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavbarLayout>
      <PhotoSlider />
      <Container>
        <Title>Why travel with TraveloHI?</Title>
        <h3>&emsp;&emsp;TraveloHI is the best travel service provider and one of the biggest in Indonesia. Since the CEO, Hans Indrawan is extremely generous and consistently do charities to the needed ones.</h3>
        <Content>
          <Title>Top 5 Hotel Recommendations</Title>
          <table>
            <thead>
              <tr>
                <th>Hotel Name</th>
                <th>City</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.HotelID}>
                  <td>{hotel.HotelName}</td>
                  <td>{hotel.CityName}</td>
                  <td>{hotel.CountryName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Title>Top 5 Flight Recommendations</Title>
          <table>
            <thead>
              <tr>
                <th>Airline</th>
                <th>Origin - Destination</th>
                <th>Departure - Arrival</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.FlightID}>
                  <td>{flight.AirlineCode}{flight.AirlineNumber}</td>
                  <td>{flight.OriginAirportCode} - {flight.DestinationAirportCode}</td>
                  <td>{new Date(flight.DepartureTime).toUTCString()} - {new Date(flight.ArrivalTime).toUTCString()}</td>
                  <td>{flight.Price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Content>
      </Container>
    </NavbarLayout>
  )
}

export default HomePage