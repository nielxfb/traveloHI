import { useEffect, useState } from "react";
import { IPromo } from "../interfaces/promo-interface";
import { get } from "../tools/api";
import styled from "styled-components";
import Error from "./form/errors";
import { firestore } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  width: fit-content;
  background-color: ${(props) => props.theme.background};
  padding: 2vw;
  border: 0.01vw solid ${(props) => props.theme.fontDimmed};
  font-size: 1.5vw;
`;

const Slider = styled.div`
  position: relative;
  width: 60vw;
  height: 30vw;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadow};

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    outline: none;
    font-size: 3vw;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
  }

  button:first-child {
    left: 1vw;
  }

  button:last-child {
    right: 1vw;
  }
`;

function PhotoSlider() {
  const [promos, setPromos] = useState<IPromo[]>([]);
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const goToNext = () => {
    const newIdx = (currIdx + 1) % promos.length;
    setCurrIdx(newIdx);
  };

  const goToPrev = () => {
    const newIdx = (currIdx - 1 + promos.length) % promos.length;
    setCurrIdx(newIdx);
  };

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

  useEffect(() => {
    fetchPromos();

    const unsubscribe = onSnapshot(collection(firestore, "promos"), (): void => {
      fetchPromos();
    });

    return () => unsubscribe();
  }, []);

  return (
    <Wrapper>
      <Error error={error} />
      {promos.length > 0 && (
        <>
          <h1>{promos[currIdx].PromoCode}</h1>
          <Slider>
            <div>
              <button onClick={goToPrev}>&lt;</button>
              <img
                src={promos[currIdx].ImageLink}
                alt={`${promos[currIdx].PromoCode} Image`}
              />
              <button onClick={goToNext}>&gt;</button>
            </div>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default PhotoSlider;
