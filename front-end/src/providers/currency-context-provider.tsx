import { createContext, useContext, useState } from "react";
import { IChildren } from "../interfaces/children-interface";

interface ICurrencyContext {
  currency: string;
  toggleCurrency: () => void;
  displayCurrency: (value: number) => string;
}

const CurrencyContext = createContext<ICurrencyContext>({} as ICurrencyContext);

const currencies = ["USD", "IDR"];

export default function CurrencyContextProvider({ children }: IChildren) {
  const [currency, setCurrency] = useState(currencies[0]);

  const displayCurrency = (value: number) => {
    return currency == "USD" ? value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }) : (value * 15701.95).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    })
  };

  const toggleCurrency = () => {
    setCurrency(currency == currencies[0] ? currencies[1] : currencies[0]);
  };

  const values = {
    currency,
    toggleCurrency,
    displayCurrency,
  };

  return (
    <CurrencyContext.Provider value={values}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  return useContext(CurrencyContext);
};
