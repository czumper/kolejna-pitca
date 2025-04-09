import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchUserProfile } from "../features/profile/profileSlice";

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { profile, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=profile");
      return;
    }

    dispatch(fetchUserProfile());
  }, [dispatch, isAuthenticated, navigate]);

  if (loading) return <Loading>Ładowanie profilu...</Loading>;

  return (
    <ProfileContainer>
      <ProfileHeader>Mój profil</ProfileHeader>

      <ProfileSection>
        <h2>Informacje</h2>
        <ProfileField>
          <Label>Imię:</Label>
          <span>
            {user?.first_name} {user?.last_name}
          </span>
        </ProfileField>
        <ProfileField>
          <Label>Nazwa użytkownika:</Label>
          <span>{user?.username}</span>
        </ProfileField>
        <ProfileField>
          <Label>Email:</Label>
          <span>{user?.email}</span>
        </ProfileField>
      </ProfileSection>

      <ButtonGroup>
        <EditButton onClick={() => navigate("/account/edit")}>
          Edytuj profil
        </EditButton>
        <EditButton onClick={() => navigate("/account/change-password")}>
          Zmień hasło
        </EditButton>
        <EditButton onClick={() => navigate("/account/change-email")}>
          Zmień email
        </EditButton>
      </ButtonGroup>
    </ProfileContainer>
  );
};

// Styled Components
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 3rem;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
`;

const ProfileHeader = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #d32f2f;
  text-transform: uppercase;
  font-weight: bold;
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  h2 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const ProfileField = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;

  span {
    flex: 1;
    font-size: 1.1rem;
    color: #555;
  }
`;

const Label = styled.label`
  font-weight: 600;
  width: 150px;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const EditButton = styled.button`
  padding: 0.9rem 1.5rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #b71c1c;
    transform: scale(1.02);
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #555;
`;

export default UserProfilePage;