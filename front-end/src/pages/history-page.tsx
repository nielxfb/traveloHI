import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useJwt } from "../hooks/use-jwt";
import { get, post } from "../tools/api";
import NavbarLayout from "../layouts/navbar-layout";
import styled from "styled-components";
import { IHotel } from "../interfaces/hotel-interface";
import { IFlight } from "../interfaces/flight-interface";
import Modal from "../components/modal";
import Button from "../components/button";
import Form from "../components/form/form";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";
import Select from "../components/form/select";
import Horizontal from "../components/form/horizontal";

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

function HistoryPage() {
  const { sub } = useJwt();
  const [response, setResponse] = useState<Response>({} as Response);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState<string>('');
  const [showHotelTickets, setShowHotelTickets] = useState<boolean>(true);
  const [showFlightTickets, setShowFlightTickets] = useState<boolean>(true);
  const [tickets, setTickets] = useState<Response>({} as Response);

  const handleShowHotel = (e: ChangeEvent<HTMLInputElement>) => {
    setShowHotelTickets(e.target.checked);
  };

  const handleShowFlight = (e: ChangeEvent<HTMLInputElement>) => {
    setShowFlightTickets(e.target.checked);
  };

  const fetchHistory = async () => {
    const url =
      import.meta.env.VITE_API_URL + "/api/fetch-expired-tickets/" + sub;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }
    setResponse(response);
    setTickets(response);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = (document.getElementById("query") as HTMLInputElement).value;

    const filteredHotelTickets = response.HotelTickets.filter((ticket) =>
      ticket.Hotel.HotelName.toLowerCase().includes(query.toLowerCase())
    );

    const filteredFlightTickets = response.FlightTickets.filter((ticket) =>
      ticket.Flight.AirlineCode.concat(ticket.Flight.AirlineNumber)
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ReviewType = (document.getElementById("ReviewType") as HTMLSelectElement).value;
    const ReviewDesc = (document.getElementById("ReviewDesc") as HTMLInputElement).value;
    const Rating = (document.getElementById("Rating") as HTMLInputElement).value;
    const IsAnonymous = (document.getElementById("IsAnonymous") as HTMLInputElement).checked;
    console.log(ReviewType, ReviewDesc, Rating, IsAnonymous);

    let ReviewTypeID;
    switch (ReviewType) {
        case "Cleanliness":
            ReviewTypeID = "RT001";
            break;
        case "Comfort":
            ReviewTypeID = "RT002";
            break;
        case "Location":
            ReviewTypeID = "RT003";
            break;
        case "Service":
            ReviewTypeID = "RT004";
            break;
    }

    const url = import.meta.env.VITE_API_URL + "/api/add-review";
    try {
        await post(url, {
            UserID: sub,
            HotelID: selectedID,
            ReviewTypeID: ReviewTypeID,
            ReviewDesc: ReviewDesc,
            Rating: parseFloat(Rating),
            IsAnonymous: IsAnonymous,
        })
    } catch (error: any) {
        alert(error.message);
        return;
    }

    alert("Successfully added review!")
  }

  return (
    <>
    <NavbarLayout>
      <Wrapper>
        <h1>History Page</h1>
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
        {showHotelTickets && response.HotelTickets && response.HotelTickets.length > 0 ? (
          response.HotelTickets.map((ticket, index) => (
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
              <Button onClick={() => {
                setShowModal(true)
                setSelectedID(ticket.Hotel.HotelID)
                }}>Add review</Button>
            </div>
          ))
        ) : (
          <p>No hotel tickets</p>
        )}
        <h2>Flight Tickets</h2>
        {showFlightTickets && response.FlightTickets && response.FlightTickets.length > 0 ? (
          response.FlightTickets.map((ticket, index) => (
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
          ))
        ) : (
          <p>No flight tickets</p>
        )}
      </Wrapper>
    </NavbarLayout>
    <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
            <Vertical>
                <label>Review Type</label>
                <Select id="ReviewType">
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Comfort">Comfort</option>
                    <option value="Location">Location</option>
                    <option value="Service">Service</option>
                </Select>
            </Vertical>
            <Vertical>
                <label>Input review</label>
                <Input type="text" id="ReviewDesc" />
            </Vertical>
            <Vertical>
                <label>Rating</label>
                <Input type="number" id="Rating" min={1} max={5} />
            </Vertical>
            <Horizontal>
                <label>Submit anonymously</label>
                <Input type="checkbox" id="IsAnonymous" />
            </Horizontal>
            <Button type="submit">Submit review</Button>
        </Form>
    </Modal>
    </>
  );
}

export default HistoryPage;
