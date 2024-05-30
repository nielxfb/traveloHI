import { useEffect, useState } from "react";
import NavbarLayout from "../layouts/navbar-layout";
import { get } from "../tools/api";
import Error from "../components/form/errors";
import styled from "styled-components";
import Card from "../components/hotels/card";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";

export interface HotelResponse {
  HotelID: string;
  HotelName: string;
  CityName: string;
  CountryName: string;
  ImageLink: string;
}

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20vw, 1fr));
  padding: 2rem;
  gap: 1rem;
  background-color: ${(props) => props.theme.secondary};
`;

function HotelsPage() {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [error, setError] = useState<string>("");

  const fetchHotels = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/fetch-hotels"
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      setError(error.message)
      return;
    }

    if (response == undefined) {
      setError("response empty")
      return;
    }
    setHotels(response as HotelResponse[]);
  }

  useEffect(() => {
    fetchHotels();

    const unsubscribe = onSnapshot(collection(firestore, "hotels"), () => {
      fetchHotels();
    });

    return () => unsubscribe();
  }, [])

  return (
    <NavbarLayout>
      <Error error={error} />
      <Wrapper>
        {hotels.map((hotel, index) => (
          <Card key={index} hotel={hotel} />
        ))}
      </Wrapper>
    </NavbarLayout>
  );
}

export default HotelsPage;
