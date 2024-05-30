import { useEffect, useState } from "react";
import { get, post } from "../tools/api";
import { IUser } from "../interfaces/user-interface";
import Card from "../components/users/card";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL + "/api/users";
    get(url, {}).then((response) => {
      const parsedUsers = response.map((userData: any) => ({
        Email: userData.Email,
        FirstName: userData.FirstName,
        LastName: userData.LastName,
        ProfilePictureLink: userData.ProfilePictureLink,
        DOB: new Date(userData.DOB),
        Gender: userData.Gender,
        Role: userData.Role,
        PersonalSecurityQuestions: userData.PersonalSecurityQuestions || [],
        LoggedIn: userData.LoggedIn,
        IsBanned: userData.IsBanned,
      }));
      setUsers(parsedUsers);
    });
  }, [trigger]);

  const handleBanUser = (user: IUser) => {
    const url = import.meta.env.VITE_API_URL + "/api/ban-user";
    post(url, { Email: user.Email }).then(() => {
      alert("User has been banned");
    });

    setTrigger((prev) => prev + 1);
  };

  return (
    <Wrapper>
      {users.length == 0 ? (
        <div>No users found</div>
      ) : (
        users.map((user, index) => (
          <div key={index}>
            <Card user={user} handleBanUser={handleBanUser} />
          </div>
        ))
      )}
    </Wrapper>
  );
}

export default UsersPage;
