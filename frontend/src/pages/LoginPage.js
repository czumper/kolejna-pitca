import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../features/auth/authSlice";

// Validation schema for login
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Nieprawidłowy adres email")
    .required("Email jest wymagany"),
  password: Yup.string()
    .required("Hasło jest wymagane")
    .min(6, "Hasło musi zawierać conajmniej 6 znaków"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  return (
    <PageContainer>
      <FormContainer>
        <FormHeader>
          <h1>Zaloguj się</h1>
          <p>Zaloguj się na swoje konto aby zamawiać pyszne pizze</p>
        </FormHeader>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <StyledForm>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <StyledField
                  type="email"
                  name="email"
                  placeholder="Wpisz swój email"
                />
                <ErrorContainer>
                  <ErrorMessage name="email" component="div" />
                </ErrorContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Hasło</Label>
                <StyledField
                  type="password"
                  name="password"
                  placeholder="Wpisz swoje hasło"
                />
                <ErrorContainer>
                  <ErrorMessage name="password" component="div" />
                </ErrorContainer>
              </FormGroup>

              <ForgotPassword to="/forgot-password">
                Zapomniałeś hasła?
              </ForgotPassword>

              {error && <ErrorAlert>{error}</ErrorAlert>}

              <SubmitButton type="submit" disabled={isSubmitting || loading}>
                {loading ? "Signing in..." : "Sign In"}
              </SubmitButton>
            </StyledForm>
          )}
        </Formik>

        <RegisterCta>
          Nie masz jeszcze konta?{" "}
          <RegisterLink to="/register">Stwórz teraz!</RegisterLink>
        </RegisterCta>
      </FormContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem 1rem;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 2rem;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    color: #666;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const ForgotPassword = styled(Link)`
  color: #d32f2f;
  font-size: 0.9rem;
  text-decoration: none;
  align-self: flex-end;
  margin-top: -0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorAlert = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
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

const RegisterCta = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;

const RegisterLink = styled(Link)`
  color: #d32f2f;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: #b71c1c;
  }
`;

export default LoginPage;
