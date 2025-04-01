import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  fetchUserAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../features/profile/profileSlice";
import { FaPlus, FaMapMarkerAlt, FaTrash, FaCheckCircle } from "react-icons/fa";

const AddressesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { addresses, loading } = useSelector((state) => state.profile);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=addresses");
      return;
    }

    dispatch(fetchUserAddresses());
  }, [dispatch, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addAddress(newAddress));
    setNewAddress({
      street: "",
      city: "",
      postal_code: "",
      country: "",
      is_default: false,
    });
    setShowAddForm(false);
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(addressId));
    }
  };

  const handleSetDefaultAddress = (addressId) => {
    dispatch(setDefaultAddress(addressId));
  };

  if (loading) return <Loading>Ładowanie adresu...</Loading>;

  return (
    <PageContainer>
      <h1>My Addresses</h1>

      <AddressButtonsContainer>
        <AddButton onClick={() => setShowAddForm(!showAddForm)}>
          <FaPlus /> {showAddForm ? "Cancel" : "Dodaj nowy adres"}
        </AddButton>
      </AddressButtonsContainer>

      {showAddForm && (
        <AddressForm onSubmit={handleSubmit}>
          <h3>Dodaj nowy adres</h3>
          <FormGroup>
            <label htmlFor="street">Ulica</label>
            <input
              type="text"
              id="street"
              name="street"
              value={newAddress.street}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <label htmlFor="city">Miejscowość:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="postal_code">Kod pocztowy:</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={newAddress.postal_code}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <label htmlFor="country">Miasto:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={newAddress.country}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormCheckbox>
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={newAddress.is_default}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  is_default: e.target.checked,
                })
              }
            />
            <label htmlFor="is_default">Ustaw jako domyślny adres</label>
          </FormCheckbox>

          <SubmitButton type="submit">Zapisz adres</SubmitButton>
        </AddressForm>
      )}

      {addresses.length === 0 ? (
        <EmptyState>
          <p>Nie zapisałeś jeszcze żadnego adresu</p>
          <p>Dodaj adres aby zamawiać szybciej.</p>
        </EmptyState>
      ) : (
        <AddressList>
          {addresses.map((address) => (
            <AddressCard key={address.id}>
              <AddressIcon>
                <FaMapMarkerAlt />
              </AddressIcon>

              <AddressContent>
                <AddressLine>{address.street}</AddressLine>
                <AddressLine>
                  {address.city}, {address.postal_code}
                </AddressLine>
                <AddressLine>{address.country}</AddressLine>

                {address.is_default && (
                  <DefaultBadge>
                    <FaCheckCircle /> Default
                  </DefaultBadge>
                )}
              </AddressContent>

              <AddressActions>
                {!address.is_default && (
                  <ActionButton
                    onClick={() => handleSetDefaultAddress(address.id)}
                  >
                    Ustaw jako domyślny
                  </ActionButton>
                )}
                <DeleteButton onClick={() => handleDeleteAddress(address.id)}>
                  <FaTrash />
                </DeleteButton>
              </AddressActions>
            </AddressCard>
          ))}
        </AddressList>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;

  h1 {
    margin-bottom: 1.5rem;
    color: #333;
  }
`;

const AddressButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #ff5a5f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #ff3a3f;
  }
`;

const AddressForm = styled.form`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;

  ${FormGroup} {
    flex: 1;
  }
`;

const FormCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;

  input {
    margin-right: 0.5rem;
  }

  label {
    font-weight: 500;
    color: #555;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #43a047;
  }
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AddressCard = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const AddressIcon = styled.div`
  font-size: 1.5rem;
  color: #ff5a5f;
  margin-right: 1rem;
  padding-top: 0.25rem;
`;

const AddressContent = styled.div`
  flex: 1;
  position: relative;
`;

const AddressLine = styled.p`
  margin: 0.25rem 0;
  color: #555;
`;

const DefaultBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #e8f5e9;
  color: #43a047;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const AddressActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background-color: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background-color: #bbdefb;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem;
  background-color: #ffebee;
  color: #e53935;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ffcdd2;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  p {
    font-size: 1.1rem;
    color: #666;
    margin: 0.5rem 0;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #555;
`;

export default AddressesPage;
