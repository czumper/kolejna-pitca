import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register, resetRegistrationSuccess } from "../features/auth/authSlice";
import apiService from "../services/api";
import debounce from "lodash/debounce";

// Walidacja hasła i reszty pól
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Nieprawidłowy adres email")
    .required("Email jest wymagany"),
  password: Yup.string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .required("Hasło jest wymagane")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Hasło musi zawierać co najmniej jedną małą literę, jedną dużą literę i jeden znak specjalny"
    ),
  password2: Yup.string()
    .oneOf([Yup.ref("password")], "Hasła muszą być takie same")
    .required("Potwierdź hasło"),
  first_name: Yup.string().required("Imię jest wymagane"),
  last_name: Yup.string().required("Nazwisko jest wymagane"),
  username: Yup.string().required("Nazwa użytkownika jest wymagana"),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading, registrationSuccess } = useSelector(
    (state) => state.auth
  );

  // Stan do sprawdzania dostępności nazwy użytkownika
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [usernameMessage, setUsernameMessage] = useState("");

  // Stan do pokazywania restrykcji hasła
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  useEffect(() => {
    // Reset registration status when unmounting
    return () => {
      dispatch(resetRegistrationSuccess());
    };
  }, [dispatch]);

  // Funkcja do sprawdzania dostępności nazwy użytkownika z debounce
  const checkUsernameAvailability = useCallback(
    debounce(async (username) => {
      if (!username) {
        console.log("Username is empty, resetting status");
        setUsernameStatus(null);
        setUsernameMessage("");
        return;
      }

      try {
        const response = await apiService.checkUsername({ username });
        const isAvailable = response.data.available;
        if (isAvailable) {
          setUsernameStatus("available");
          setUsernameMessage("Nazwa użytkownika jest dostępna!");
        } else {
          setUsernameStatus("taken");
          setUsernameMessage("Nazwa użytkownika jest już zajęta!");
        }
      } catch (err) {
        setUsernameStatus("error");
        setUsernameMessage("Błąd podczas sprawdzania nazwy użytkownika.");
      }
    }, 500), // 500ms opóźnienia
    []
  );

  const handleSubmit = (values) => {
    dispatch(register(values));
  };

  if (registrationSuccess) {
    return (
      <PageContainer>
        <RegisterContainer>
          <SuccessMessage>
            <h2>Rejestracja udana!</h2>
            <p>
              Wysłaliśmy Ci email z linkiem aktywacyjnym, sprawdź swoją
              skrzynkę!
            </p>
            <BackToLoginButton to="/login">
              Powrót do logowania
            </BackToLoginButton>
          </SuccessMessage>
        </RegisterContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <RegisterContainer>
        <RegisterHeader>Stwórz konto!</RegisterHeader>

        {error && typeof error === "string" && <ErrorAlert>{error}</ErrorAlert>}

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            password2: "",
            first_name: "",
            last_name: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, values, setFieldTouched }) => (
            <StyledForm>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="first_name">Imię</Label>
                  <StyledField
                    type="text"
                    name="first_name"
                    placeholder="Imię"
                  />
                  <ErrorContainer>
                    <ErrorMessage name="first_name" component="div" />
                  </ErrorContainer>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="last_name">Nazwisko</Label>
                  <StyledField
                    type="text"
                    name="last_name"
                    placeholder="Nazwisko"
                  />
                  <ErrorContainer>
                    <ErrorMessage name="last_name" component="div" />
                  </ErrorContainer>
                </FormGroup>
              </FormGrid>

              <FormGroup>
                <Label htmlFor="username">Nazwa użytkownika</Label>
                <StyledField
                  type="text"
                  name="username"
                  placeholder="Nazwa użytkownika"
                  onChange={(e) => {
                    const username = e.target.value;
                    values.username = username; // Aktualizuj wartość w Formik
                    setFieldTouched("username", true);
                    checkUsernameAvailability(username); // Sprawdzaj z debounce
                  }}
                />
                <StatusContainer>
                  {usernameStatus === "available" && (
                    <StatusMessage success>{usernameMessage}</StatusMessage>
                  )}
                  {usernameStatus === "taken" && (
                    <StatusMessage>{usernameMessage}</StatusMessage>
                  )}
                  {usernameStatus === "error" && (
                    <StatusMessage>{usernameMessage}</StatusMessage>
                  )}
                  <ErrorMessage name="username" component="div" />
                  {error && error.username && <div>{error.username}</div>}
                </StatusContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <StyledField
                  type="email"
                  name="email"
                  placeholder="Adres email"
                />
                <ErrorContainer>
                  <ErrorMessage name="email" component="div" />
                  {error && error.email && <div>{error.email}</div>}
                </ErrorContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Hasło</Label>
                <StyledField
                  type="password"
                  name="password"
                  placeholder="Stwórz hasło"
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={() => setShowPasswordRules(false)}
                />
                {showPasswordRules && (
                  <PasswordRules>
                    <p>Hasło musi zawierać:</p>
                    <ul>
                      <li>Minimum 8 znaków</li>
                      <li>Co najmniej jedną dużą literę</li>
                      <li>Co najmniej jeden znak specjalny (@$!%*?&)</li>
                    </ul>
                  </PasswordRules>
                )}
                <ErrorContainer>
                  <ErrorMessage name="password" component="div" />
                </ErrorContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password2">Potwierdź hasło</Label>
                <StyledField
                  type="password"
                  name="password2"
                  placeholder="Potwierdź hasło"
                />
                <StatusContainer>
                  {values.password &&
                  values.password2 &&
                  values.password === values.password2 ? (
                    <StatusMessage success>Hasła są identyczne!</StatusMessage>
                  ) : values.password && values.password2 ? (
                    <StatusMessage>Hasła nie są identyczne!</StatusMessage>
                  ) : null}
                  <ErrorMessage name="password2" component="div" />
                </StatusContainer>
              </FormGroup>

              <SubmitButton
                type="submit"
                disabled={
                  isSubmitting || loading || usernameStatus !== "available"
                }
              >
                {loading ? "Tworzenie konta..." : "Utwórz konto"}
              </SubmitButton>
            </StyledForm>
          )}
        </Formik>

        <LoginCta>
          Masz już konto? <LoginLink to="/login">Zaloguj się</LoginLink>
        </LoginCta>
      </RegisterContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #f8f8f8;
`;

const RegisterContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  padding: 3rem;
  width: 100%;
  max-width: 600px;
`;

const RegisterHeader = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 2rem;
  text-align: center;
  color: #d32f2f;
  text-transform: uppercase;
  font-weight: bold;
`;

const ErrorAlert = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 2rem;
  font-size: 1rem;
  text-align: center;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const StyledField = styled(Field)`
  padding: 0.9rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #d32f2f;
    box-shadow: 0 0 5px rgba(211, 47, 47, 0.3);
  }
`;

const ErrorContainer = styled.div`
  color: #c62828;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  min-height: 1.5rem;
`;

const StatusContainer = styled.div`
  margin-top: 0.5rem;
  min-height: 1.5rem;
`;

const StatusMessage = styled.div`
  color: ${(props) => (props.success ? "#2e7d32" : "#c62828")};
  font-size: 0.9rem;
`;

const PasswordRules = styled.div`
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #555;

  p {
    margin: 0 0 0.5rem;
    font-weight: 500;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0;
  }

  li {
    margin-bottom: 0.3rem;
  }
`;

const SubmitButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #b71c1c;
    transform: scale(1.02);
  }

  &:disabled {
    background-color: #e57373;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginCta = styled.div`
  margin-top: 2.5rem;
  text-align: center;
  color: #666;
  font-size: 1rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
`;

const LoginLink = styled(Link)`
  color: #d32f2f;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;

  &:hover {
    color: #b71c1c;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;

  h2 {
    color: #2e7d32;
    margin-bottom: 1.5rem;
    font-size: 2rem;
    text-transform: uppercase;
  }

  p {
    color: #555;
    margin-bottom: 2rem;
    line-height: 1.6;
    font-size: 1.1rem;
  }
`;

const BackToLoginButton = styled(Link)`
  display: inline-block;
  background-color: #d32f2f;
  color: white;
  padding: 1rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #b71c1c;
    transform: scale(1.02);
  }
`;

export default RegisterPage;
