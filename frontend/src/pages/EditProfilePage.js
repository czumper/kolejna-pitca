import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateUserProfile } from "../features/auth/authSlice"; // Wracamy do updateUserProfile

const EditProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    first_name: Yup.string().required("Imię jest wymagane"),
    last_name: Yup.string().required("Nazwisko jest wymagane"),
    username: Yup.string().required("Nazwa użytkownika jest wymagana"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(updateUserProfile(values)) // Wracamy do updateUserProfile
      .unwrap()
      .then(() => {
        alert("Profil zaktualizowany pomyślnie!");
        navigate("/profile");
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  return (
    <PageContainer>
      <EditProfileContainer>
        <h1>Edytuj profil</h1>

        {error && typeof error === "string" && <ErrorAlert>{error}</ErrorAlert>}

        <Formik
          initialValues={{
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            username: user?.username || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <StyledForm>
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

              <FormGroup>
                <Label htmlFor="username">Nazwa użytkownika</Label>
                <StyledField
                  type="text"
                  name="username"
                  placeholder="Nazwa użytkownika"
                />
                <ErrorContainer>
                  <ErrorMessage name="username" component="div" />
                </ErrorContainer>
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting || loading}>
                {loading ? "Zapisywanie..." : "Zapisz zmiany"}
              </SubmitButton>
            </StyledForm>
          )}
        </Formik>
      </EditProfileContainer>
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

const EditProfileContainer = styled.div`
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

export default EditProfilePage;