import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useJwt } from "../../hooks/use-jwt";
import { get } from "../../tools/api";
import Dropdown from "./dropdown";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase/config";
import { useAuth } from "../../providers/auth-context-provider";

const Bar = styled.form`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  border: 0.125px solid ${(props) => props.theme.fontDimmed};
  border-radius: 0.5rem;
  justify-content: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
`;

const SearchIcon = styled(FaSearch)`
  color: ${(props) => props.theme.fontDimmed};
`;

function SearchBar() {
  const {isLoggedIn} = useAuth();
  const { sub } = useJwt();
  const [history, setHistory] = useState<string[]>([]);
  const [recom, setRecom] = useState<string[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setVisible(false);
  }, [selected])

  const fetchSearches = async () => {
    if (!isLoggedIn) {
      return;
    }
    let history;
    try {
      const url = import.meta.env.VITE_API_URL + "/api/fetch-history/" + sub;
      history = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setHistory(history.SearchHistory);

    let recommendation;
    try {
      const url = import.meta.env.VITE_API_URL + "/api/fetch-top-5-searches";
      recommendation = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setRecom(recommendation);
  }

  const displayHistory = async () => {
    fetchSearches();

    if (!isLoggedIn) {
      return;
    }
    let history;
    try {
      const url = import.meta.env.VITE_API_URL + "/api/fetch-history/" + sub;
      history = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setHistory(history.SearchHistory);

    let recommendation;
    try {
      const url = import.meta.env.VITE_API_URL + "/api/fetch-top-5-searches";
      recommendation = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setRecom(recommendation);

    setVisible(true);
  };

  return (
    <Bar onSubmit={(e) => {
      e.preventDefault();
      setVisible(false)
      navigate(`/search/${selected}`)
    }}>
      <SearchIcon />
      <Input
        type="text"
        value={selected}
        placeholder="Search.."
        onClick={displayHistory}
        onChange={(e) => setSelected(e.target.value)}
      />
      <Dropdown
        history={history}
        visible={visible}
        recommendations={recom}
        setSelected={setSelected}
      />
    </Bar>
  );
}

export default SearchBar;
