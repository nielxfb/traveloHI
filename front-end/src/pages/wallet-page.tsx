import styled from "styled-components";
import ProfileSidebarLayout from "../layouts/profile-sidebar-layout";
import { useAuth } from "../providers/auth-context-provider";
import { useEffect, useState } from "react";
import { useCurrency } from "../providers/currency-context-provider";
import Button from "../components/button";
import Modal from "../components/modal";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";
import { useJwt } from "../hooks/use-jwt";
import { get, put } from "../tools/api";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.background};
  padding: 2rem;
  border: 1px solid ${(props) => props.theme.fontDimmed};
  shadow: ${(props) => props.theme.shadow};
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  min-height: calc(100vh - 100px);
  height: fit-content;
  width: 80%;
`;

function WalletPage() {
  const { sub } = useJwt();
  const { user, logout } = useAuth();
  const { displayCurrency } = useCurrency();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  const handleUpdateWallet = async () => {
    const newBalance = document.getElementById(
      "newBalance"
    ) as HTMLInputElement;
    const newValue = newBalance.value;
    const url = import.meta.env.VITE_API_URL + "/api/update-wallet-balance";
    try {
      await put(url, {
        UserID: sub,
        WalletBalance: parseFloat(newValue.toString()),
      });
    } catch (error: any) {
      alert(error.message);
      return;
    }

    await addDoc(collection(firestore, "wallets"), {
      data: "Hai",
    });

    alert("Wallet balance updated");
    setShowModal(false);
  };

  const fetchWalletBalance = async () => {
    const url =
      import.meta.env.VITE_API_URL + "/api/fetch-wallet-balance/" + sub;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setBalance(response);
  };

  useEffect(() => {
    fetchWalletBalance();

    const unsubscribe = onSnapshot(collection(firestore, "wallets"), () => {
      fetchWalletBalance();
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ProfileSidebarLayout>
        <Wrapper>
          <h1>My balance: {displayCurrency(balance)}</h1>
          <Button type="button" onClick={() => setShowModal(true)}>
            Update wallet balance
          </Button>
        </Wrapper>
      </ProfileSidebarLayout>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Vertical>
          <label>New balance</label>
          <Input type="number" id="newBalance" />
          <Button type="button" onClick={handleUpdateWallet}>
            Update
          </Button>
        </Vertical>
      </Modal>
    </>
  );
}

export default WalletPage;
