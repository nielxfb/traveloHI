import styled from "styled-components";
import NavbarLayout from "../layouts/navbar-layout";
import { Link, useParams } from "react-router-dom";
import { useJwt } from "../hooks/use-jwt";
import { post } from "../tools/api";
import { IHotel } from "../interfaces/hotel-interface";
import { ChangeEvent, useEffect, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";
import Center from "../components/center";
import { IFlight } from "../interfaces/flight-interface";
import { useCurrency } from "../providers/currency-context-provider";
import Button from "../components/button";
import Horizontal from "../components/form/horizontal";
import Select from "../components/form/select";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";

const Title = styled.h1`
  color: ${(props) => props.theme.fontDimmed};
  font-size: 2rem;
  align-items: left;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
  justify-content: left;
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: left;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: ${(props) => props.theme.shadow};
  border: 1px solid ${(props) => props.theme.fontDimmed};
  width: 20%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 100%;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  background-color: ${(props) => props.theme.background};
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: ${(props) => props.theme.shadow};
  border: 1px solid ${(props) => props.theme.fontDimmed};
`;

const HotelLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
`;

const FlightLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
`;

interface Response {
  Hotels: IHotel[];
  Flights: IFlight[];
}

function SearchResult() {
  const { sub } = useJwt();
  const { query } = useParams();
  const { displayCurrency } = useCurrency();
  const [response, setResponse] = useState<Response>();
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [querySearch, setQuerySearch] = useState<string>("");
  const [currentHotelPage, setCurrentHotelPage] = useState(1);
  const [currentFlightPage, setCurrentFlightPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(2);
  const [selectedFacilities, setSelectedFacilities] = useState({
    AC: false,
    SwimmingPool: false,
    WiFi: false,
    Restaurant: false,
    Elevator: false,
  });

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFacilities((prev) => ({
      ...prev,
      [e.target.id]: e.target.checked,
    }));
  };

  const filterHotels = (hotels: IHotel[]) => {
    return hotels.filter((hotel) => {
      if (selectedFacilities.AC && !hotel.AC) {
        return false;
      }
      if (selectedFacilities.SwimmingPool && !hotel.SwimmingPool) {
        return false;
      }
      if (selectedFacilities.WiFi && !hotel.WiFi) {
        return false;
      }
      if (selectedFacilities.Restaurant && !hotel.Restaurant) {
        return false;
      }
      if (selectedFacilities.Elevator && !hotel.Elevator) {
        return false;
      }
      return true;
    });
  };

  const handleNextHotelPage = () => {
    setCurrentHotelPage((prevPage) => prevPage + 1);
  };

  const handlePrevHotelPage = () => {
    setCurrentHotelPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextFlightPage = () => {
    setCurrentFlightPage((prevPage) => prevPage + 1);
  };

  const handlePrevFlightPage = () => {
    setCurrentFlightPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleResultsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setResultsPerPage(() => parseInt(e.target.value));
  };

  const startHotelIndex = (currentHotelPage - 1) * resultsPerPage;
  const endHotelIndex = startHotelIndex + resultsPerPage;

  const startFlightIndex = (currentFlightPage - 1) * resultsPerPage;
  const endFlightIndex = startFlightIndex + resultsPerPage;

  const handleSearch = async () => {
    if (querySearch == "" || querySearch == undefined || querySearch != query) {
      return;
    }
    let response;
    try {
      const url = import.meta.env.VITE_API_URL + "/api/search";
      response = await post(url, { Query: querySearch, UserID: sub });
    } catch (error: any) {
      alert(error.message);
      return;
    }

    await addDoc(collection(firestore, "search-history"), {
      data: "Hai",
    });

    setResponse(response as Response);
    setHotels(response.Hotels);
  };

  const applyFilter = () => {
    if (!response) {
      return;
    }
    const filteredHotels = filterHotels(response.Hotels);
    setResponse({
      ...response,
      Hotels: filteredHotels,
    });
  };

  useEffect(() => {
    handleSearch();

    const unsubscribe = onSnapshot(collection(firestore, "searches"), () => {
      handleSearch();
    });

    return () => unsubscribe();
  }, [querySearch]);

  useEffect(() => {
    setQuerySearch(query!);
  }, [query]);

  return (
    <NavbarLayout>
      <Title>Search Result for {query}</Title>
      <Container>
        <FilterContainer>
          <Vertical>
            <label>Paginate results by</label>
            <Select
              value={resultsPerPage}
              onChange={handleResultsPerPageChange}
            >
              <option value={2}>2 per page</option>
              <option value={20}>20 per page</option>
              <option value={25}>25 per page</option>
              <option value={30}>30 per page</option>
            </Select>
          </Vertical>
          {response && response.Hotels && response.Hotels.length > 0 ? (
            <Vertical>
              <label>Filter by facilities</label>
              <Horizontal>
                <label>AC</label>
                <Input type="checkbox" id="AC" onChange={handleFilterChange} />
              </Horizontal>
              <Horizontal>
                <label>Swimming Pool</label>
                <Input
                  type="checkbox"
                  id="SwimmingPool"
                  onChange={handleFilterChange}
                />
              </Horizontal>
              <Horizontal>
                <label>Wi-Fi</label>
                <Input
                  type="checkbox"
                  id="WiFi"
                  onChange={handleFilterChange}
                />
              </Horizontal>
              <Horizontal>
                <label>Restaurant</label>
                <Input
                  type="checkbox"
                  id="Restaurant"
                  onChange={handleFilterChange}
                />
              </Horizontal>
              <Horizontal>
                <label>Elevator</label>
                <Input
                  type="checkbox"
                  id="Elevator"
                  onChange={handleFilterChange}
                />
              </Horizontal>
              <Button type="button" onClick={() => applyFilter()}>
                Apply filter
              </Button>
            </Vertical>
          ) : (
            <></>
          )}
          <Button
            type="button"
            onClick={() =>
              setResponse((prev) => ({ ...prev!, Hotels: hotels }))
            }
          >
            Revert
          </Button>
        </FilterContainer>
        <Content>
          {!response ||
            (!response.Hotels && !response.Flights) ||
            (response.Hotels.length <= 0 && response.Flights.length <= 0 && (
              <BoxContainer>
                <Center>
                  <h1>No result found</h1>
                </Center>
              </BoxContainer>
            ))}
          {response && response.Hotels && response.Hotels.length > 0 && (
            <BoxContainer>
              {response.Hotels.slice(startHotelIndex, endHotelIndex).map(
                (hotel, index) => (
                  <HotelLink key={index} to={`/hotels/${hotel.HotelID}`}>
                    <h1>{hotel.HotelName}</h1>
                    <h2>
                      {hotel.Location.CityName}, {hotel.Location.CountryName}
                    </h2>
                  </HotelLink>
                )
              )}
              <Horizontal>
                <Button
                  onClick={handlePrevHotelPage}
                  disabled={currentHotelPage === 1}
                >
                  Previous Page
                </Button>
                <Button
                  onClick={handleNextHotelPage}
                  disabled={
                    !response || endHotelIndex >= response.Hotels.length
                  }
                >
                  Next Page
                </Button>
              </Horizontal>
            </BoxContainer>
          )}
          {response && response.Flights && response.Flights.length > 0 && (
            <BoxContainer>
              {response.Flights.slice(startFlightIndex, endFlightIndex).map(
                (flight, index) => (
                  <FlightLink
                    key={index}
                    to={`/flight-detail/${flight.FlightID}`}
                  >
                    <h1>
                      {flight.AirlineCode}
                      {flight.AirlineNumber}
                    </h1>
                    <h2>
                      {flight.OriginAirportCode} -{" "}
                      {flight.DestinationAirportCode}
                    </h2>
                    <h2>
                      {new Date(flight.DepartureTime).toUTCString()} -{" "}
                      {new Date(flight.ArrivalTime).toUTCString()}
                    </h2>
                    <h2>
                      Price: {displayCurrency(flight.Price ? flight.Price : 0)}
                    </h2>
                  </FlightLink>
                )
              )}
              <Horizontal>
                <Button
                  onClick={handlePrevFlightPage}
                  disabled={currentFlightPage === 1}
                >
                  Previous Page
                </Button>
                <Button
                  onClick={handleNextFlightPage}
                  disabled={
                    !response || endFlightIndex >= response.Flights.length
                  }
                >
                  Next Page
                </Button>
              </Horizontal>
            </BoxContainer>
          )}
        </Content>
      </Container>
    </NavbarLayout>
  );
}

export default SearchResult;
