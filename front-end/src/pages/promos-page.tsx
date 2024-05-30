import { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IPromo } from "../interfaces/promo-interface";
import { get, put } from "../tools/api";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";
import Button from "../components/button";
import Modal from "../components/modal";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";
import UploadPromoImage from "../firebase/upload-promo-image";

const PromoCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.fontDimmed};
  color: ${(props) => props.theme.font};
  background-color: ${(props) => props.theme.background};

  img {
    max-width: 10vw;
    max-height: 10vh;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
`;

const ImageContainer = styled.div`
  height: 20vh;
  width: auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

function PromosPage() {
  const [promos, setPromos] = useState<IPromo[]>([]);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPromo, setSelectedPromo] = useState<IPromo>({} as IPromo);

  const imageRef = useRef<HTMLInputElement>(null);

  const useShowModal = () => {
    setShowModal((prev) => !prev);
  };

  useEffect(() => {
    fetchPromos();

    const unsubscribe = onSnapshot(collection(firestore, "promos"), () => {
      fetchPromos();
    });

    return () => unsubscribe();
  }, []);

  const fetchPromos = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/fetch-promos";
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    if (response == undefined) {
      setError("Failed to retrieve promos");
      return;
    }

    setError("");
    setPromos(response as IPromo[]);
  };

  const openModal = (promo: IPromo) => {
    setShowModal(true);
    setSelectedPromo(promo);
  };

  const handleImageChange = async () => {
    const image = imageRef.current?.files?.[0];
    if (image) {
      const link = await UploadPromoImage(image, selectedPromo.PromoCode);
      setSelectedPromo({ ...selectedPromo, ImageLink: link });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedPromo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/update-promo";
    selectedPromo.DiscountValue = parseInt(selectedPromo.DiscountValue.toString())
    try {
      await put(url, selectedPromo);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    await addDoc(collection(firestore, "promos"), {
      data: "hai",
    });

    alert("Successfully updated promo");
    setShowModal(false);
  };

  return (
    <>
      <Wrapper>
        {promos.map((promo, index) => (
          <PromoCard key={index}>
            <h1>Code: {promo.PromoCode}</h1>
            <img src={promo.ImageLink} />
            <p>Discount Value: {promo.DiscountValue}</p>
            <Button type="button" onClick={() => openModal(promo)}>
              Update Promo
            </Button>
          </PromoCard>
        ))}
      </Wrapper>
      <Modal show={showModal} onClose={useShowModal}>
        <Vertical>
          <ImageContainer>
            <img
              src={selectedPromo.ImageLink}
              alt={`${selectedPromo.PromoCode} Image`}
            />
          </ImageContainer>
          <Vertical>
            <label>New Promo Code</label>
            <Input
              type="text"
              value={selectedPromo.PromoCode}
              onChange={handleChange}
              id="PromoCode"
            />
          </Vertical>
          <Vertical>
            <label>New Discount Value</label>
            <Input
              type="number"
              value={selectedPromo.DiscountValue}
              onChange={handleChange}
              id="DiscountValue"
            />
          </Vertical>
          <Vertical>
            <label>New Image</label>
            <Input type="file" ref={imageRef} onChange={handleImageChange} />
          </Vertical>
          <Vertical>
            <Button type="button" onClick={handleUpdate}>
              Update
            </Button>
          </Vertical>
        </Vertical>
      </Modal>
    </>
  );
}

export default PromosPage;
