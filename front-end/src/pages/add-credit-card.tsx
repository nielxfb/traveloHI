import styled from "styled-components";
import Title from "../components/form/title";
import Form from "../components/form/form";
import Vertical from "../components/form/vertical";
import { get, post } from "../tools/api";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "../components/button";
import Select from "../components/form/select";
import Error from "../components/form/errors";
import Input from "../components/form/input";
import { ICreditCard } from "../interfaces/credit-card-interface";
import Horizontal from "../components/form/horizontal";
import { useNavigate } from "react-router-dom";
import { useJwt } from "../hooks/use-jwt";
import { fetchCreditCards } from "../tools/global-controller";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  border-radius: 0.5rem;
  padding: 2rem;
  margin: 2rem;
  background-color: ${(props) => props.theme.background};
`;

interface IBank {
  BankID: string;
  BankName: string;
}

function AddCreditCard() {
  const { sub } = useJwt();
  const [error, setError] = useState<string>("");
  const [banks, setBanks] = useState<IBank[]>([]);
  const [cardData, setCardData] = useState<ICreditCard>({} as ICreditCard);
  const [currBank, setCurrBank] = useState<IBank>({
    BankID: "BN001",
    BankName: "BCA",
  });
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const months = Array.from({ length: 12 }, (_, index) => {
    const month = (index + 1).toString().padStart(2, "0");
    return { value: month, label: month };
  });

  const years = Array.from({ length: 10 }, (_, index) => {
    const year = currentYear + index;
    return { value: year.toString(), label: year.toString() };
  });

  const fetchBanks = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/fetch-banks";
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    if (response == undefined) {
      setError("Failed to retrieve banks");
      return;
    }

    setError("");
    setBanks(response as IBank[]);
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.id]: e.target.value });
  };

  const handleBankChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = banks.find((bank) => bank.BankName === e.target.value);

    if (selectedBank) {
      setCurrBank(selectedBank);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      UserID: sub,
      BankID: currBank.BankID,
      CardNumber: cardData.CardNumber,
      ExpiredMonth: parseInt(expiryMonth),
      ExpiredYear: parseInt(expiryYear),
      CVV: cardData.CVV,
    };

    const url = import.meta.env.VITE_API_URL + "/api/add-credit-card";
    try {
      await post(url, data);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError("");
    await addDoc(collection(firestore, "banks"), {
      data: "Hai",
    });
    alert("Credit card added successfully");
    navigate("/credit-cards");
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Add Credit Card</Title>
        <Vertical>
          <label>Bank Name</label>
          <Select onChange={handleBankChange}>
            {banks.map((bank, index) => (
              <option key={index}>{bank.BankName}</option>
            ))}
          </Select>
        </Vertical>
        <Vertical>
          <label>Card Number</label>
          <Input type="number" onChange={handleChange} id="CardNumber" />
        </Vertical>
        <Horizontal>
          <Vertical>
            <label>Expiry Month</label>
            <Select
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              id="ExpiryMonth"
            >
              <option value="0">Month</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Select>
          </Vertical>
          <Vertical>
            <label>Expiry Year</label>
            <Select
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              id="ExpiryYear"
            >
              <option value="0">Year</option>
              {years.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </Select>
          </Vertical>
        </Horizontal>
        <Vertical>
          <label>CVV</label>
          <Input type="number" onChange={handleChange} id="CVV" />
        </Vertical>
        <Error error={error} />
        <Button type="submit">Add Card</Button>
      </Form>
    </Wrapper>
  );
}

export default AddCreditCard;
