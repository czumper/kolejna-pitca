import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { changeEmail } from "../features/auth/authSlice";

const ChangeEmailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    new_email: Yup.string()
      .email("Nieprawidłowy adres email")
      .required("Nowy email jest wymagany"),
    new_email2: Yup.string()
      .oneOf([Yup.ref("new_email")], "Emaile muszą być takie same")
      .required("Potwierdź nowy email"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(changeEmail({ email: values.new_email }))
      .unwrap()
      .then(() => {
        alert("Email zmieniony pomyślnie! Sprawdź skrzynkę, aby potwierdzić.");
        navigate("/profile");
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  return (
    <PageContainer>
      <ChangeEmailContainer>
        <h1>Zmień email</h1>

        {error && typeof error === "string" && <ErrorAlert>{error}</ErrorAlert>}

        <Formik
          initialValues={{
            new_email: "",
            new_email2: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <StyledForm>
              <FormGroup>
                <Label htmlFor="new_email">Nowy email</Label>
                <StyledField
                  type="email"
                  name="new_email"
                  placeholder="Nowy email"
                />
                <ErrorContainer>
                  <ErrorMessage name="new_email" component="div" />
                </ErrorContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="new_email2">Potwierdź nowy email</Label>
                <StyledField
                  type="email"
                  name="new_email2"
                  placeholder="Potwierdź nowy email"
                />
                <ErrorContainer>
                  <ErrorMessage name="new_email2" component="div" />
                </ErrorContainer>
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting || loading}>
                {loading ? "Zmiana emaila..." : "Zmień email"}
              </SubmitButton>
            </StyledForm>
          )}
        </Formik>
      </ChangeEmailContainer>
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

const ChangeEmailContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  padding: 3rem;
  width: 100%;
  max-width: 500px;

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    color: #d32f2f;
    text-transform: uppercase;
    font-weight: bold;
  }
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

export default ChangeEmailPage;