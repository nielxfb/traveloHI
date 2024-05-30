import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useJwt } from "../hooks/use-jwt";
import { IFlight } from "../interfaces/flight-interface";
import { IHotel } from "../interfaces/hotel-interface";
import { get } from "../tools/api";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";
import NavbarLayout from "../layouts/navbar-layout";
import styled from "styled-components";
import Horizontal from "../components/form/horizontal";
import Input from "../components/form/input";
import Form from "../components/form/form";

interface IRoomType {
  RoomType: string;
  Price: number;
  ImageLink: string;
}

interface IHotelTicket {
  Hotel: IHotel;
  RoomType: IRoomType;
  CheckInDate: string;
  CheckOutDate: string;
}

interface IFlightTicket {
  Flight: IFlight;
  SeatNumber: number;
}

interface Response {
  HotelTickets: IHotelTicket[];
  FlightTickets: IFlightTicket[];
}

const Wrapper = styled.div`
  width: 80%;
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  padding: 2rem;
  border: 1px solid ${(props) => props.theme.fontDimmed};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

function MyTicketPage() {
  const { sub } = useJwt();
  const [response, setResponse] = useState<Response>({} as Response);
  const [tickets, setTickets] = useState<Response>({} as Response);
  const [showHotelTickets, setShowHotelTickets] = useState<boolean>(true);
  const [showFlightTickets, setShowFlightTickets] = useState<boolean>(true);

  const handleShowHotel = (e: ChangeEvent<HTMLInputElement>) => {
    setShowHotelTickets(e.target.checked);
  };

  const handleShowFlight = (e: ChangeEvent<HTMLInputElement>) => {
    setShowFlightTickets(e.target.checked);
  };

  const fetchOnGoingTickets = async () => {
    const url =
      import.meta.env.VITE_API_URL + "/api/fetch-ongoing-tickets/" + sub;

    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setResponse(response as Response);
    setTickets(response as Response);
  };

  useEffect(() => {
    fetchOnGoingTickets();

    const unsubscribe = onSnapshot(collection(firestore, "tickets"), () => {
      fetchOnGoingTickets();
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = (document.getElementById("query") as HTMLInputElement).value;

    const filteredHotelTickets = response.HotelTickets.filter((ticket) =>
      ticket.Hotel.HotelName.toLowerCase().includes(query.toLowerCase())
    );
    
    const filteredFlightTickets = response.FlightTickets.filter((ticket) =>
      (ticket.Flight.AirlineCode.concat(ticket.Flight.AirlineNumber))
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    if (query != "" && query != undefined && query != null) {
      setResponse((prevState) => ({
        ...prevState,
        HotelTickets: filteredHotelTickets,
        FlightTickets: filteredFlightTickets,
      }));
    }
  };

  return (
    <NavbarLayout>
      <Wrapper>
        <h1>My Tickets</h1>
        <Horizontal>
          <Horizontal>
            <label>Show hotel tickets</label>
            <Input
              type="checkbox"
              checked={showHotelTickets}
              onChange={handleShowHotel}
            />
          </Horizontal>
          <Horizontal>
            <label>Show flight tickets</label>
            <Input
              type="checkbox"
              checked={showFlightTickets}
              onChange={handleShowFlight}
            />
          </Horizontal>
        </Horizontal>
        <Form onSubmit={handleSearch}>
          <Input type="text" placeholder="Search tickets.." id="query" onChange={() => setResponse(tickets)} />
        </Form>
        <h2>Hotel Tickets</h2>
        {showHotelTickets &&
          response.HotelTickets?.map((ticket, index) => (
            <div key={index}>
              <h3>{ticket.Hotel.HotelName}</h3>
              <p>
                Room Type: {ticket.RoomType.RoomType} - Price:{" "}
                {ticket.RoomType.Price}
              </p>
              <p>
                Check In: {new Date(ticket.CheckInDate).toUTCString()} - Check
                Out: {new Date(ticket.CheckOutDate).toUTCString()}
              </p>
              <p>
                Staying duration:{" "}
                {(new Date(ticket.CheckOutDate.split("T")[0]).getTime() -
                  new Date(ticket.CheckInDate.split("T")[0]).getTime()) /
                  (3600 * 24 * 1000)}{" "}
                night(s)
              </p>
            </div>
          ))}
        <h2>Flight Tickets</h2>
        {showFlightTickets &&
          response.FlightTickets?.map((ticket, index) => (
            <div key={index}>
              <h3>
                {ticket.Flight.AirlineCode}
                {ticket.Flight.AirlineNumber}
              </h3>
              <p>
                From: {ticket.Flight.OriginAirportCode} - To:{" "}
                {ticket.Flight.DestinationAirportCode}
              </p>
              <p>Seat Number: {ticket.SeatNumber}</p>
              <p>
                Departure Time:{" "}
                {new Date(ticket.Flight.DepartureTime).toUTCString()}
              </p>
              <p>
                Arrival Time:{" "}
                {new Date(ticket.Flight.ArrivalTime).toUTCString()}
              </p>
            </div>
          ))}
      </Wrapper>
    </NavbarLayout>
  );
}

export default MyTicketPage;
