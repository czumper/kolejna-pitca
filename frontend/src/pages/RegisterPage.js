import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register, resetRegistrationSuccess } from "../features/auth/authSlice";

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Nieprawidłowy adres email")
    .required("Email jest wymagany"),
  password: Yup.string()
    .min(8, "Hasło musi mieć conajmniej 8 znaków")
    .required("Hasło jest wymagane")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Hasło musi zawierać conajmniej jedną małą litere, jedną dużą literę, jedną cyfrę i jeden znak specjalny"
    ),
  password2: Yup.string()
    .oneOf([Yup.ref("password")], "Hasła muszą być takie same")
    .required("Potwierdź hasło"),
  first_name: Yup.string().required("Imię jest wymagane"),
  last_name: Yup.string().required("Nazwisko jest wymagane"),
  username: Yup.string().required("Nazwa jest wymagana"),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading, registrationSuccess } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Reset registration status when unmounting
    return () => {
      dispatch(resetRegistrationSuccess());
    };
  }, [dispatch]);

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
              Wysłaliśmy ci email z linkiem aktywacyjnym, sprawdź swoją
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
        <RegisterHeader>Stwórz konto</RegisterHeader>

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
          {({ isSubmitting, errors }) => (
            <StyledForm>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="first_name">Imie</Label>
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
                />
                <ErrorContainer>
                  <ErrorMessage name="username" component="div" />
                  {error && error.username && <div>{error.username}</div>}
                </ErrorContainer>
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
                />
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
                <ErrorContainer>
                  <ErrorMessage name="password2" component="div" />
                </ErrorContainer>
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting || loading}>
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
  padding: 2rem 1rem;
`;

const RegisterContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
`;

const RegisterHeader = styled.h1`
  font-size: 1.75rem;
  margin: 0 0 1.5rem;
  text-align: center;
  color: #333;
`;

const ErrorAlert = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
`;

const StyledField = styled(Field)`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #d32f2f;
  }
`;

const ErrorContainer = styled.div`
  color: #c62828;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
`;

const SubmitButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;

  &:hover {
    background-color: #b71c1c;
  }

  &:disabled {
    background-color: #e57373;
    cursor: not-allowed;
  }
`;

const LoginCta = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;

const LoginLink = styled(Link)`
  color: #d32f2f;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: #b71c1c;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 1rem;

  h2 {
    color: #2e7d32;
    margin-bottom: 1rem;
  }

  p {
    color: #555;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
`;

const BackToLoginButton = styled(Link)`
  display: inline-block;
  background-color: #d32f2f;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }
`;

export default RegisterPage;
