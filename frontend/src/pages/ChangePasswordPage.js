import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { changePassword } from "../features/auth/authSlice";

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    old_password: Yup.string().required("Stare hasło jest wymagane"),
    new_password: Yup.string()
      .min(8, "Nowe hasło musi mieć co najmniej 8 znaków")
      .required("Nowe hasło jest wymagane")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Nowe hasło musi zawierać co najmniej jedną małą literę, jedną dużą literę i jeden znak specjalny"
      ),
    new_password2: Yup.string()
      .oneOf([Yup.ref("new_password")], "Hasła muszą być takie same")
      .required("Potwierdź nowe hasło"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(changePassword(values))
      .unwrap()
      .then(() => {
        alert("Hasło zmienione pomyślnie!");
        navigate("/profile");
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  return (
    <PageContainer>
      <ChangePasswordContainer>
        <h1>Zmień hasło</h1>

        {error && typeof error === "string" && <ErrorAlert>{error}</ErrorAlert>}

        <Formik
          initialValues={{
            old_password: "",
            new_password: "",
            new_password2: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <StyledForm>
              <FormGroup>
                <Label htmlFor="old_password">Stare hasło</Label>
                <StyledField
                  type="password"
                  name="old_password"
                  placeholder="Stare hasło"
                />
                <ErrorContainer>
                  <ErrorMessage name="old_password" component="div" />
                </ErrorContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="new_password">Nowe hasło</Label>
                <StyledField
                  type="password"
                  name="new_password"
                  placeholder="Nowe hasło"
                />
                <ErrorContainer>
                  <ErrorMessage name="new_password" component="div" />
                </ErrorContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="new_password2">Potwierdź nowe hasło</Label>
                <StyledField
                  type="password"
                  name="new_password2"
                  placeholder="Potwierdź nowe hasło"
                />
                <ErrorContainer>
                  <ErrorMessage name="new_password2" component="div" />
                </ErrorContainer>
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting || loading}>
                {loading ? "Zmiana hasła..." : "Zmień hasło"}
              </SubmitButton>
            </StyledForm>
          )}
        </Formik>
      </ChangePasswordContainer>
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

const ChangePasswordContainer = styled.div`
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

export default ChangePasswordPage;