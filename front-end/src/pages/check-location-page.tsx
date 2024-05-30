import React, { FormEvent, useRef } from "react";
import NavbarLayout from "../layouts/navbar-layout";
import Form from "../components/form/form";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";
import Button from "../components/button";
import { post } from "../tools/api";
import CenterizedContent from "../layouts/centerized-content";

function CheckLocationPage() {
  const imageRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const image = imageRef.current?.files?.[0];

    if (!image) {
      alert("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    let response;
    try {
      response = await post(
        "http://localhost:9898/get-predict-result",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
      );
    } catch (error: any) {
      alert(error.message);
      return;
    }

    alert(response.message);
  };

  return (
    <NavbarLayout>
      <CenterizedContent>
        <Form onSubmit={handleSubmit}>
          <Vertical>
            <label>Upload Image</label>
            <Input type="file" ref={imageRef} />
          </Vertical>
          <Button type="submit">Check Location</Button>
        </Form>
      </CenterizedContent>
    </NavbarLayout>
  );
}

export default CheckLocationPage;
