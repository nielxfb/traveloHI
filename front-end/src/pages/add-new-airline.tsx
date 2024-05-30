import styled from "styled-components";
import Form from "../components/form/form";
import Title from "../components/form/title";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";
import { useRef, useState } from "react";
import Button from "../components/button";
import Error from "../components/form/errors";
import UploadAirlineImage from "../firebase/upload-airline-image";
import { post } from "../tools/api";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebase/config";

const Wrapper = styled.div`
  width: 100%;
  padding: 2rem;
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.fontDimmed};
`;

function AddNewAirline() {
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const logoRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const logo = logoRef.current?.files?.[0];
    if (logo == undefined) {
      setError("Please select a logo");
      return;
    }

    const link = await UploadAirlineImage(logo, name);

    if (link) {
      try {
        const url = import.meta.env.VITE_API_URL + "/api/add-airline";
        await post(url, {
          AirlineName: name,
          AirlineCode: code,
          ImageLink: link,
        });
      } catch (error: any) {
        setError(error.message);
        return;
      }

      setError("");
      await addDoc(collection(firestore, "airlines"), {
        data: "Hai",
      });
      await addDoc(collection(firestore, "searches"), {
        data: "Hai",
      });
      alert("Airline added successfully");
    } else {
      setError("Failed to upload logo");
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Add new Airline</Title>
        <Vertical>
          <label>Airline Name</label>
          <Input onChange={(e) => setName(e.target.value)} type="text" />
        </Vertical>
        <Vertical>
          <label>Airline Code</label>
          <Input onChange={(e) => setCode(e.target.value)} type="text" />
        </Vertical>
        <Vertical>
          <label>Logo</label>
          <Input type="file" ref={logoRef} />
        </Vertical>
        <Error error={error} />
        <Button type="submit">Add Airline</Button>
      </Form>
    </Wrapper>
  );
}

export default AddNewAirline;
