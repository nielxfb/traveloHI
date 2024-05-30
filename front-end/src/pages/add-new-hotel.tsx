import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Title from "../components/form/title";
import Form from "../components/form/form";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";
import { IHotel } from "../interfaces/hotel-interface";
import { ILocation } from "../interfaces/location-interface";
import Button from "../components/button";
import { post } from "../tools/api";
import Error from "../components/form/errors";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import UploadHotelImage from "../firebase/upload-hotel-image";
import Horizontal from "../components/form/horizontal";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebase/config";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.fontDimmed};
  overflow-y: auto;
`;

function AddNewHotel() {
  const [hotelData, setHotelData] = useState<IHotel>({} as IHotel);
  const [locationData, setLocationData] = useState<ILocation>({} as ILocation);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const imageRef = useRef<HTMLInputElement>(null);

  const handleHotelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked, type } = e.target;
    setHotelData({
      ...hotelData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocationData({
      ...locationData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const image = imageRef.current?.files?.[0];

    if (image == undefined) {
      setError("Image is required");
      return;
    }

    const link = await UploadHotelImage(image, image.name);

    if (link) {
      setHotelData({
        ...hotelData,
        ImageLink: link,
      });
    } else {
      setError("Image upload failed");
      return;
    }

    let response;
    try {
      const url = import.meta.env.VITE_API_URL + "/api/add-location";
      response = await post(url, locationData);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    const id = response.ID;

    if (id == "") {
      setError("Location ID is empty");
      return;
    }

    try {
      const url = import.meta.env.VITE_API_URL + "/api/add-hotel";
      await post(url, { ...hotelData, LocationID: id });
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError("");
    await addDoc(collection(firestore, "hotels"), {
      data: "Hai",
    });
    await addDoc(collection(firestore, "searches"), {
      data: "Hai",
    });
    alert("Hotel has been added!");
    navigate("/admin");
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Add New Hotel</Title>
        <Vertical>
          <label>Hotel Name</label>
          <Input type="text" id="HotelName" onChange={handleHotelChange} />
        </Vertical>
        <Vertical>
          <label>Description</label>
          <Input type="text" id="Description" onChange={handleHotelChange} />
        </Vertical>
        <Vertical>
          <label>Hotel Address</label>
          <Input type="text" id="Address" onChange={handleLocationChange} />
        </Vertical>
        <Vertical>
          <label>City</label>
          <Input type="text" id="CityName" onChange={handleLocationChange} />
        </Vertical>
        <Vertical>
          <label>Country</label>
          <Input type="text" id="CountryName" onChange={handleLocationChange} />
        </Vertical>
        <Vertical>
          <label>Image</label>
          <Input type="file" ref={imageRef} />
        </Vertical>
        <Horizontal>
          <label>AC</label>
          <Input type="checkbox" id="AC" onChange={handleHotelChange} />
        </Horizontal>
        <Horizontal>
          <label>Swimming Pool</label>
          <Input
            type="checkbox"
            id="SwimmingPool"
            onChange={handleHotelChange}
          />
        </Horizontal>
        <Horizontal>
          <label>Wi-Fi</label>
          <Input type="checkbox" id="WiFi" onChange={handleHotelChange} />
        </Horizontal>
        <Horizontal>
          <label>Restaurant</label>
          <Input type="checkbox" id="Restaurant" onChange={handleHotelChange} />
        </Horizontal>
        <Horizontal>
          <label>Elevator</label>
          <Input type="checkbox" id="Elevator" onChange={handleHotelChange} />
        </Horizontal>
        <Error error={error} />
        <Button type="submit">Add</Button>
      </Form>
    </Wrapper>
  );
}

export default AddNewHotel;
