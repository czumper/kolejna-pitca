import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaStar } from "react-icons/fa";
import {
  createReview,
  updateReview,
} from "../../features/reviews/reviewsSlice";
import { toast } from "react-toastify";

// Validation schema
const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .required("Wybierz ocenę")
    .min(1, "Wybierz ocenę od 1 do 5")
    .max(5, "Ocena musi być od 1 do 5"),
  comment: Yup.string()
    .required("Komantarz jest wymagany")
    .min(10, "Komantarz musi zawierać conajmniej 10 znaków")
    .max(500, "Komantarz musi zawierać 500 lub mniej znaków"),
});

const ReviewForm = ({ pizzaId, review = null, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const initialValues = {
    rating: review ? review.rating : 0,
    comment: review ? review.comment : "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (review) {
        await dispatch(
          updateReview({
            reviewId: review.id,
            reviewData: { ...values, pizza: pizzaId },
          })
        ).unwrap();
        toast.success("Twoja ocena została zaktualizowana!");
      } else {
        await dispatch(
          createReview({
            ...values,
            pizza: pizzaId,
          })
        ).unwrap();
        toast.success("Twoja ocena została dodana!");
        resetForm();
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Coś poszło nie tak. Spróbuj ponownie.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ReviewSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <StyledForm>
          <FormGroup>
            <Label>Twoja ocena</Label>
            <StarsContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  type="button"
                  onClick={() => setFieldValue("rating", star)}
                  selected={star <= values.rating}
                >
                  <FaStar />
                </StarButton>
              ))}
            </StarsContainer>
            <ErrorContainer>
              <ErrorMessage name="rating" component="div" />
            </ErrorContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="comment">Twoja recenzja</Label>
            <StyledTextarea
              as="textarea"
              name="comment"
              placeholder="Powiedz innym co myślisz o tej pizzy..."
              rows="4"
            />
            <CharacterCount $error={values.comment.length > 500}>
              {values.comment.length}/500
            </CharacterCount>
            <ErrorContainer>
              <ErrorMessage name="comment" component="div" />
            </ErrorContainer>
          </FormGroup>

          <ButtonGroup>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Potwierdzanie..."
                : review
                ? "Zaktualizuj recenzję"
                : "Opublikuj recenzję"}
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
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${(props) => (props.selected ? "#FFB400" : "#CCC")};
  transition: transform 0.2s, color 0.2s;

  &:hover {
    transform: scale(1.1);
    color: #ffb400;
  }

  &:focus {
    outline: none;
  }
`;

const StyledTextarea = styled(Field)`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #d32f2f;
  }
`;

const CharacterCount = styled.div`
  align-self: flex-end;
  font-size: 0.8rem;
  color: ${(props) => (props.$error ? "#c62828" : "#666")};
`;

const ErrorContainer = styled.div`
  color: #c62828;
  font-size: 0.85rem;
  min-height: 1.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
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

export default ReviewForm;
