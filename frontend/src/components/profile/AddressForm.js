import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  createAddress,
  updateAddress,
} from "../../features/profile/profileSlice";
import { toast } from "react-toastify";

// Validation schema for address
const AddressSchema = Yup.object().shape({
  address_line1: Yup.string()
    .required("Ulica jest wymagana")
    .max(255, "Adres musi zawierać 255 lub mniej znaków"),
  address_line2: Yup.string().max(
    255,
    "Druga linia adresu musi zawierać 255 lub mniej znaków"
  ),
  city: Yup.string()
    .required("Miasto jest wymagane")
    .max(100, "Miasto musi zawierać 100 lub mniej znaków"),
  state: Yup.string()
    .required("Województwo jest wymagane")
    .max(100, "Województwo musi zawierać 100 lub mniej znaków"),
  postal_code: Yup.string()
    .required("Kod pocztowy jest wymagany")
    .max(20, "Kod pocztowy musi zawierać 20 lub mniej znaków")
    .matches(/^[0-9a-zA-Z\s-]+$/, "Nieprawidłowy format kodu pocztowego"),
  is_default: Yup.boolean(),
});

const AddressForm = ({ address = null, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const initialValues = {
    address_line1: address?.address_line1 || "",
    address_line2: address?.address_line2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postal_code: address?.postal_code || "",
    is_default: address?.is_default || false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (address) {
        // Update existing address
        await dispatch(
          updateAddress({ addressId: address.id, addressData: values })
        ).unwrap();
        toast.success("Adres zaktualizowany!");
      } else {
        // Create new address
        await dispatch(createAddress(values)).unwrap();
        toast.success("Adres dodany!");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Błąd zapisywania adresu. Spróbuj ponownie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AddressSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <StyledForm>
          <FormGroup>
            <Label htmlFor="address_line1">Ulica*</Label>
            <StyledField type="text" name="address_line1" />
            <ErrorContainer>
              <ErrorMessage name="address_line1" component="div" />
            </ErrorContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="address_line2">Mieszkanie (Opcjonalne)</Label>
            <StyledField type="text" name="address_line2" />
            <ErrorContainer>
              <ErrorMessage name="address_line2" component="div" />
            </ErrorContainer>
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="city">Miejscowość*</Label>
              <StyledField type="text" name="city" />
              <ErrorContainer>
                <ErrorMessage name="city" component="div" />
              </ErrorContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="state">Województwo*</Label>
              <StyledField type="text" name="state" />
              <ErrorContainer>
                <ErrorMessage name="state" component="div" />
              </ErrorContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="postal_code">Kod pocztowy*</Label>
              <StyledField type="text" name="postal_code" />
              <ErrorContainer>
                <ErrorMessage name="postal_code" component="div" />
              </ErrorContainer>
            </FormGroup>
          </FormRow>

          <CheckboxContainer>
            <CheckboxField type="checkbox" name="is_default" id="is_default" />
            <CheckboxLabel htmlFor="is_default">
              Ustaw jako domyślny adres dostawy
            </CheckboxLabel>
          </CheckboxContainer>

          <ButtonGroup>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Zapisywanie..."
                : address
                ? "Aktualizuj adres"
                : "Dodaj adres"}
            </SubmitButton>

            {onCancel && (
              <CancelButton type="button" onClick={onCancel}>
                Anuluj
              </CancelButton>
            )}
          </ButtonGroup>
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxField = styled(Field)`
  margin-right: 0.75rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: #555;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }

  &:disabled {
    background-color: #e57373;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #999;
  }
`;

export default AddressForm;
