import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateUserProfile } from "../../features/profile/profileSlice";
import { toast } from "react-toastify";

// Validation schema for user profile
const ProfileSchema = Yup.object().shape({
  first_name: Yup.string()
    .max(30, "Imię musi zawierać 30 lub mniej znaków")
    .required("Imię jest wymagane"),
  last_name: Yup.string()
    .max(30, "Nazwisko musi zawierać 30 lub mniej znaków")
    .required("Nazwisko jest wymagane"),
  username: Yup.string()
    .min(3, "Nazwa użytkownika musi zawierać conajmniej 3 znaki")
    .max(20, "Nazwa użytkownika musi zawierać 20 lub mniej znaków")
    .required("Nazwa użytkownika jest wymagana")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Nazwa użytkownika może zawierać tylko litery, cyfry i znak podkreślenia"
    ),
  phone_number: Yup.string().matches(
    /^\+?[0-9]{10,15}$/,
    "Nieprawidłowy numer telefonu"
  ),
});

const ProfileForm = ({ user }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateUserProfile(values)).unwrap();
      toast.success("Profil zaktualizowany!");
    } catch (error) {
      toast.error("Błąd podczas aktualizacji profilu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        username: user?.username || "",
        phone_number: user?.phone_number || "",
      }}
      validationSchema={ProfileSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <StyledForm>
          <FormRow>
            <FormGroup>
              <Label htmlFor="first_name">Imie</Label>
              <StyledField type="text" name="first_name" placeholder="Imię" />
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
          </FormRow>

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

          <FormGroup>
            <Label htmlFor="phone_number">Numer telefonu</Label>
            <StyledField
              type="text"
              name="phone_number"
              placeholder="Numer telefonu"
            />
            <ErrorContainer>
              <ErrorMessage name="phone_number" component="div" />
            </ErrorContainer>
          </FormGroup>

          <ReadOnlyField>
            <Label>Adres email</Label>
            <ReadOnlyValue>{user?.email}</ReadOnlyValue>
            <ChangeEmailLink to="/account/change-email">
              Zmień email
            </ChangeEmailLink>
          </ReadOnlyField>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
          </SubmitButton>
        </StyledForm>
      )}
    </Formik>
  );
};

// Styled Components
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
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

const ReadOnlyField = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReadOnlyValue = styled.div`
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 1rem;
  color: #666;
`;

const ChangeEmailLink = styled(Link)`
  color: #d32f2f;
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: 0.5rem;
  align-self: flex-start;

  &:hover {
    text-decoration: underline;
  }
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
  align-self: flex-start;

  &:hover {
    background-color: #b71c1c;
  }

  &:disabled {
    background-color: #e57373;
    cursor: not-allowed;
  }
`;

export default ProfileForm;
