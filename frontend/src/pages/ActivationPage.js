import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import apiService from "../services/api";
import pizzaImage from "../assets/Pitcanf.png"; // Dodaj obrazek pizzy do assets/

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f8f8;
`;

const ActivationContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 600px;
  text-align: center;
  position: relative;
`;

const Title = styled.h1`
  color: #d32f2f;
  margin-bottom: 20px;
  font-size: 2.5rem;
  text-transform: uppercase;
  font-weight: bold;
`;

const Message = styled.p`
  margin-bottom: 30px;
  font-size: 1.3rem;
  line-height: 1.6;
  color: #333;
`;

const SpinningPizza = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  animation: spin 4s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 12px 30px;
  background-color: #d32f2f;
  color: white;
  text-decoration: none;
  font-weight: bold;
  border-radius: 5px;
  margin-top: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #b71c1c;
    transform: scale(1.05);
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d32f2f;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
          "Konto aktywowane pomyślnie, mordeczko! Możesz się zalogować."
        );
      } catch (error) {
        setStatus("error");
        const errorMessage =
          error.response?.data?.detail ||
          "Coś sięzepsuło. Link może być nieważny lub wygasł.";
        setMessage(errorMessage);
      }
    };

    if (uid && token) {
      activateAccount();
    } else {
      // Jeśli brak uid/token (np. wejście z redirectu z backendu)
      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get("status");

      switch (statusParam) {
        case "success":
          setStatus("success");
          setMessage(
            "Konto aktywowane pomyślnie, mordeczko! Możesz się zalogować."
          );
          break;
        case "already_activated":
          setStatus("error");
          setMessage(
            "Konto już było aktywowane, kurwa. Spróbuj się zalogować."
          );
          break;
        case "invalid":
          setStatus("error");
          setMessage(
            "Link aktywacyjny jest nieprawidłowy lub wygasł. Skontaktuj się z nami!"
          );
          break;
        case "error":
          setStatus("error");
          setMessage(
            "Coś się zepsuło. Spróbuj jeszcze raz albo napisz do nas."
          );
          break;
        default:
          setStatus("error");
          setMessage("Nie wiem, co się stało. Spróbuj jeszcze raz.");
      }
    }
  }, [uid, token]);

  return (
    <PageContainer>
      <ActivationContainer>
        {status === "loading" ? (
          <>
            <LoadingSpinner />
            <Title>Aktywacja konta...</Title>
            <Message>Chwila, mordeczko, zaraz będzie gotowe!</Message>
          </>
        ) : (
          <>
            <SpinningPizza src={pizzaImage} alt="Obracająca się pizza" />
            <Title>
              {status === "success" && "Konto aktywowane!"}
              {status === "error" && "Kurwa, coś poszło nie tak!"}
            </Title>
            <Message>{message}</Message>
            <StyledLink to={status === "success" ? "/login" : "/"}>
              {status === "success" ? "Przejdź do logowania" : "Wróć na główną"}
            </StyledLink>
          </>
        )}
      </ActivationContainer>
    </PageContainer>
  );
};

export default ActivationPage;
