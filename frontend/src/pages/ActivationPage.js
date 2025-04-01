import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import apiService from "../services/api";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
`;

const ActivationContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const Title = styled.h1`
  color: #d32f2f;
  margin-bottom: 20px;
`;

const Message = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.5;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #d32f2f;
  color: white;
  text-decoration: none;
  font-weight: bold;
  border-radius: 5px;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }
`;

const ActivationPage = () => {
  const { uid, token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await apiService.activateAccount({ uid, token });
        setStatus("success");
        setMessage(
          "Twoje konto zostało aktywowane! Możesz teraz się zalogować."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.detail ||
            "Nie udało się aktywować konta. Link może być nieważny lub wygasł."
        );
      }
    };

    activateAccount();
  }, [uid, token]);

  return (
    <PageContainer>
      <ActivationContainer>
        <Title>
          {status === "loading" && "Aktywacja konta..."}
          {status === "success" && "Konto aktywowane!"}
          {status === "error" && "Błąd aktywacji"}
        </Title>
        <Message>{message}</Message>
        {status !== "loading" && (
          <StyledLink to="/login">
            {status === "success"
              ? "Przejdź do logowania"
              : "Wróć do strony głównej"}
          </StyledLink>
        )}
      </ActivationContainer>
    </PageContainer>
  );
};

export default ActivationPage;
