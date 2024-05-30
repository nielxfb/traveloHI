import styled from "styled-components";
import Form from "../components/form/form";
import Title from "../components/form/title";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";
import { useRef, useState } from "react";
import Button from "../components/button";
import Error from "../components/form/errors";
import UploadPromoImage from "../firebase/upload-promo-image";
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

function AddPromo() {
  const [code, setCode] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const imageRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const image = imageRef.current?.files?.[0];
    if (image == undefined) {
      setError("Please select an image");
      return;
    }

    const link = await UploadPromoImage(image, code);
    if (link) {
      try {
        const url = import.meta.env.VITE_API_URL + "/api/add-promo";
        await post(url, {
          PromoCode: code,
          DiscountValue: parseInt(discount),
          ImageLink: link,
        });
      } catch (error: any) {
        setError(error.message);
        return;
      }

      setError("");
      await addDoc(collection(firestore, "promos"), {
        data: "hai",
      })
      alert("Promo added successfully");
    } else {
      setError("Failed to upload image");
      return;
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Add new Promo</Title>
        <Vertical>
          <label>Promo Code</label>
          <Input type="text" onChange={(e) => setCode(e.target.value)} />
        </Vertical>
        <Vertical>
          <label>Discount Value (in %)</label>
          <Input type="number" onChange={(e) => setDiscount(e.target.value)} />
        </Vertical>
        <Vertical>
          <label>Promo Image</label>
          <Input type="file" ref={imageRef} />
        </Vertical>
        <Error error={error} />
        <Button type="submit">Add Promo</Button>
      </Form>
    </Wrapper>
  );
}

export default AddPromo;
