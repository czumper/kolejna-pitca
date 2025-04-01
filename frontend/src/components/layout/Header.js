import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  FaPizzaSlice,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { logout } from "../../features/auth/authSlice";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <HeaderContainer>
      <Logo to="/">
        <FaPizzaSlice /> PITCERNIA
      </Logo>

      <MobileMenuButton onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>

      <Nav mobileMenuOpen={mobileMenuOpen}>
        <NavItem to="/">Dom</NavItem>
        <NavItem to="/menu">Menu</NavItem>

        {isAuthenticated ? (
          <>
            <NavItem to="/my-orders">Moje zamówienia</NavItem>
            <UserDropdown>
              <DropdownButton>
                <FaUser />
                {user?.first_name || "Account"}
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem to="/account">Profil</DropdownItem>
                <DropdownItem to="/addresses">Moje Adresy</DropdownItem>
                <DropdownItem as="button" onClick={handleLogout}>
                  Wyloguj
                </DropdownItem>
              </DropdownMenu>
            </UserDropdown>
          </>
        ) : (
          <>
            <NavItem to="/login">Zaloguj</NavItem>
            <NavItem to="/register">Zarejestruj</NavItem>
          </>
        )}

        <CartButton to="/cart">
          <FaShoppingCart />
          <CartCount>{cartItemCount}</CartCount>
        </CartButton>
      </Nav>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #d32f2f;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1.8rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: #f8f9fa;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: ${({ mobileMenuOpen }) => (mobileMenuOpen ? "flex" : "none")};
  }
`;

const NavItem = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: #d32f2f;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0;
    width: 100%;
    text-align: center;
  }
`;

const UserDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0;

  &:hover {
    color: #d32f2f;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
  display: none;

  ${UserDropdown}:hover & {
    display: block;
  }

  @media (max-width: 768px) {
    position: static;
    box-shadow: none;
    margin-top: 0.5rem;
    width: 100%;
  }
`;

const DropdownItem = styled(Link)`
  color: #333;
  text-decoration: none;
  padding: 0.75rem 1rem;
  display: block;
  transition: background-color 0.3s;
  text-align: left;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const CartButton = styled(Link)`
  position: relative;
  color: #333;
  text-decoration: none;
  font-size: 1.5rem;

  &:hover {
    color: #d32f2f;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #d32f2f;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Header;
