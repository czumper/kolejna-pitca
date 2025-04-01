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
      <h1>Mój profil</h1>

      <ProfileSection>
        <h2>Informacje</h2>
        <ProfileField>
          <label>Imie:</label>
          <span>
            {user?.first_name} {user?.last_name}
          </span>
        </ProfileField>
        <ProfileField>
          <label>Email:</label>
          <span>{user?.email}</span>
        </ProfileField>
      </ProfileSection>

      <ButtonGroup>
        <EditButton onClick={() => navigate("/profile/edit")}>
          Edytuj profil
        </EditButton>
        <EditButton onClick={() => navigate("/profile/change-password")}>
          Zmień hasło
        </EditButton>
      </ButtonGroup>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  h2 {
    color: #333;
    margin-bottom: 1rem;
  }
`;

const ProfileField = styled.div`
  display: flex;
  margin-bottom: 1rem;

  label {
    font-weight: bold;
    width: 120px;
    color: #555;
  }

  span {
    flex: 1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const EditButton = styled.button`
  padding: 10px 20px;
  background-color: #ff5a5f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #ff3a3f;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #555;
`;

export default UserProfilePage;
