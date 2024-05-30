import styled from "styled-components";
import { useAuth } from "../providers/auth-context-provider";
import { Redirect } from "../tools/redirect";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Form from "../components/form/form";
import Input from "../components/form/input";
import Horizontal from "../components/form/horizontal";
import Vertical from "../components/form/vertical";
import Select from "../components/form/select";
import { genders } from "../settings/user-items";
import Button from "../components/button";
import UploadProfilePhoto from "../firebase/upload-profile-photo";
import { IUser } from "../interfaces/user-interface";
import { patch } from "../tools/api";
import { useJwt } from "../hooks/use-jwt";
import Error from "../components/form/errors";
import ProfileSidebarLayout from "../layouts/profile-sidebar-layout";

const Wrapper = styled.div`
  display: flex;
  padding: 2rem;
  gap: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.fontDimmed};
  color: ${(props) => props.theme.font};
  background-color: ${(props) => props.theme.background};
`;

const Image = styled.div`
  width: 150px;
  height: 150px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

function ProfilePage() {
  const { user, logout } = useAuth();
  const { sub } = useJwt();
  const [profileLink, setProfileLink] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<IUser>(user!);

  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async () => {
    const image = imageRef.current?.files?.[0];
    if (image == undefined) {
      setError("Please select an image");
      return;
    }

    const link = await UploadProfilePhoto(
      image,
      `${user?.FirstName}_${user?.LastName}`
    );

    if (link == undefined) {
      setError("Failed to upload image");
      return;
    }

    setProfileLink(link);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked, type } = event.target;
    setUserData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGenderChange = (gender: string) => {
    setUserData((prev) => ({
      ...prev,
      Gender: gender,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUserData((prev) => ({
      ...prev,
      ProfilePictureLink: profileLink,
    }));

    try {
      const url = import.meta.env.VITE_API_URL + "/api/update-user";
      const dob = new Date(userData.DOB).toISOString().split("T")[0];
      await patch(url, {
        sub: sub,
        user: {
          ...userData,
          DOB: dob,
        },
      });
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError("");
    alert("Successfully updated user! Please log in again to see changes.");
    logout();
  };

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  useEffect(() => {
    setProfileLink(user.ProfilePictureLink);
    setUserData(user);
  }, []);

  return (
    <ProfileSidebarLayout>
      <Wrapper>
        <ProfileWrapper>
          <Image>
            <img
              src={profileLink}
              alt={`${userData.FirstName}-${userData.LastName}-ProfilePicture`}
            />
          </Image>
          <Input type="file" onChange={handleImageChange} ref={imageRef} />
        </ProfileWrapper>
        <Vertical>
          <Form onSubmit={handleSubmit}>
            <Horizontal>
              <Vertical>
                <label>First Name</label>
                <Input
                  value={userData.FirstName}
                  id="FirstName"
                  onChange={handleChange}
                />
              </Vertical>
              <Vertical>
                <label>Last Name</label>
                <Input
                  value={userData.LastName}
                  id="LastName"
                  onChange={handleChange}
                />
              </Vertical>
            </Horizontal>
            <Vertical>
              <label>Email</label>
              <Input
                value={userData.Email}
                id="Email"
                onChange={handleChange}
              />
            </Vertical>
            <Vertical>
              <label>Phone Number</label>
              <Input
                value={userData.PhoneNumber}
                id="PhoneNumber"
                onChange={handleChange}
              />
            </Vertical>
            <Vertical>
              <label>DOB</label>
              <Input
                type="date"
                value={new String(userData.DOB).split("T")[0]}
                id="DOB"
                onChange={handleChange}
              />
            </Vertical>
            <Vertical>
              <label>Address</label>
              <Input
                value={userData.Address}
                id="Address"
                onChange={handleChange}
              />
            </Vertical>
            <Vertical>
              <label>Gender</label>
              <Select
                value={userData.Gender}
                onChange={(e) => handleGenderChange(e.target.value)}
              >
                {genders.map((gender, index) => (
                  <option key={index}>{gender}</option>
                ))}
              </Select>
            </Vertical>
            <Horizontal>
              <label>Subscribe to news letter</label>
              <Input
                type="checkbox"
                checked={userData.Subscribe}
                id="Subscribe"
                onChange={handleChange}
              />
            </Horizontal>
            <Error error={error} />
            <Button type="submit">Update Profile</Button>
          </Form>
          <Button onClick={logout}>Logout</Button>
        </Vertical>
      </Wrapper>
    </ProfileSidebarLayout>
  );
}

export default ProfilePage;
