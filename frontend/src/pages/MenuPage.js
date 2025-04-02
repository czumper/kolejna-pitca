import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchPizzas } from "../features/menu/menuSlice";
import PizzaCard from "../components/menu/PizzaCard";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const MenuPage = () => {
  const dispatch = useDispatch();
  const { pizzas, loading } = useSelector((state) => state.menu);

  // Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
    size: {
      small: false,
      medium: true, // Domyślnie średni rozmiar
      large: false,
    },
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = {};

    // Dodaj zapytanie wyszukiwania
    if (searchQuery) {
      params.search = searchQuery;
    }

    // Dodaj filtr wegetariański
    if (filters.vegetarian) {
      params.is_vegetarian = true;
    }

    // Dodaj filtr ostrości
    if (filters.spicy) {
      params.is_spicy = true;
    }

    // Dodaj wybrany rozmiar pizzy
    const selectedSizes = [];
    if (filters.size.small) selectedSizes.push("small");
    if (filters.size.medium) selectedSizes.push("medium");
    if (filters.size.large) selectedSizes.push("large");

    const selectedSize = getSelectedSize();
    params.size = selectedSize;

    // Dodaj zakres cen na podstawie wybranego rozmiaru
    if (priceRange.min || priceRange.max) {
      if (selectedSize === "small") {
        if (priceRange.min) params.price_small_min = priceRange.min;
        if (priceRange.max) params.price_small_max = priceRange.max;
      } else if (selectedSize === "medium") {
        if (priceRange.min) params.price_medium_min = priceRange.min;
        if (priceRange.max) params.price_medium_max = priceRange.max;
      } else if (selectedSize === "large") {
        if (priceRange.min) params.price_large_min = priceRange.min;
        if (priceRange.max) params.price_large_max = priceRange.max;
      }
    }

    // Wywołaj akcję fetchPizzas z parametrami
    dispatch(fetchPizzas(params));
  }, [dispatch, searchQuery, filters, priceRange]);

  const getSelectedSize = () => {
    if (filters.size.small) return "small";
    if (filters.size.medium) return "medium";
    if (filters.size.large) return "large";
    return "medium"; // Domyślnie średni
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // Zezwól tylko na liczby
    if (value === "" || /^\d+$/.test(value)) {
      setPriceRange((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setFilters({
      vegetarian: false,
      spicy: false,
      size: {
        small: false,
        medium: true, // Domyślnie średni
        large: false,
      },
    });
  };

  const handleFilterChange = (filter, value) => {
    if (filter === "size") {
      // Upewnij się, że tylko jeden rozmiar jest wybrany
      setFilters({
        ...filters,
        size: {
          small: value === "small" ? !filters.size.small : false,
          medium: value === "medium" ? !filters.size.medium : false,
          large: value === "large" ? !filters.size.large : false,
        },
      });
    } else {
      setFilters({
        ...filters,
        [filter]: !filters[filter],
      });
    }
  };

  // Check if any filters are active
  const isFiltering =
    searchQuery !== "" ||
    filters.vegetarian ||
    filters.spicy ||
    priceRange.min !== "" ||
    priceRange.max !== "";

  return (
    <PageContainer>
      <MenuHeader>
        <h1>Menu</h1>
        <MenuSubtitle>Dobre pizze jedz!</MenuSubtitle>
      </MenuHeader>

      <SearchFilterContainer>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Szukaj pizze..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchContainer>

        <FilterToggle onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filtry
        </FilterToggle>
      </SearchFilterContainer>

      <FiltersContainer show={showFilters}>
        <FilterOption>
          <CheckboxInput
            type="checkbox"
            id="vegetarian"
            checked={filters.vegetarian}
            onChange={() => handleFilterChange("vegetarian")}
          />
          <FilterLabel htmlFor="vegetarian">Wege</FilterLabel>
        </FilterOption>

        <FilterOption>
          <CheckboxInput
            type="checkbox"
            id="spicy"
            checked={filters.spicy}
            onChange={() => handleFilterChange("spicy")}
          />
          <FilterLabel htmlFor="spicy">Ostra</FilterLabel>
        </FilterOption>

        <FilterOption>
          <CheckboxInput
            type="checkbox"
            id="small"
            checked={filters.size.small}
            onChange={() => handleFilterChange("size", "small")}
          />
          <FilterLabel htmlFor="small">Mała</FilterLabel>
        </FilterOption>

        <FilterOption>
          <CheckboxInput
            type="checkbox"
            id="medium"
            checked={filters.size.medium}
            onChange={() => handleFilterChange("size", "medium")}
          />
          <FilterLabel htmlFor="medium">Średnia</FilterLabel>
        </FilterOption>

        <FilterOption>
          <CheckboxInput
            type="checkbox"
            id="large"
            checked={filters.size.large}
            onChange={() => handleFilterChange("size", "large")}
          />
          <FilterLabel htmlFor="large">Duża</FilterLabel>
        </FilterOption>

        <FilterOption>
          <FilterLabel>Cena od:</FilterLabel>
          <PriceInput
            type="text"
            name="min"
            value={priceRange.min}
            onChange={handlePriceChange}
            placeholder="Min"
          />
        </FilterOption>

        <FilterOption>
          <FilterLabel>Cena do:</FilterLabel>
          <PriceInput
            type="text"
            name="max"
            value={priceRange.max}
            onChange={handlePriceChange}
            placeholder="Max"
          />
        </FilterOption>

        {isFiltering && (
          <ClearFiltersButton onClick={handleClearFilters}>
            <FaTimes /> Wyczyść filtry
          </ClearFiltersButton>
        )}
      </FiltersContainer>

      {loading ? (
        <LoadingMessage>Ładowanie pizz...</LoadingMessage>
      ) : pizzas.results && pizzas.results.length === 0 ? (
        <NoResultsMessage>
          Nie znaleziono pizz spełniających twoje kryteria.
          <button onClick={handleClearFilters}>Wyczyść filtry</button>
        </NoResultsMessage>
      ) : (
        <PizzasGrid>
          {pizzas.results?.map((pizza) => (
            <PizzaCard
              key={pizza.id}
              pizza={pizza}
              selectedSize={getSelectedSize()}
            />
          ))}
        </PizzasGrid>
      )}
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const MenuHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    color: #d32f2f;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
`;

const MenuSubtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
  font-style: italic;
`;

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 3rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #d32f2f;
    box-shadow: 0 0 5px rgba(211, 47, 47, 0.3);
  }
`;

const FilterToggle = styled.button`
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 0.9rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  transition: all 0.3s;

  &:hover {
    border-color: #d32f2f;
    color: #d32f2f;
    transform: scale(1.02);
  }
`;

const FiltersContainer = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FilterOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;

  &:checked {
    background-color: #d32f2f;
    border-color: #d32f2f;
  }

  &:checked::after {
    content: "✔";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
  }

  &:hover {
    border-color: #d32f2f;
  }
`;

const FilterLabel = styled.label`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #d32f2f;
  }
`;

const PriceInput = styled.input`
  width: 80px;
  padding: 0.6rem;
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

const ClearFiltersButton = styled.button`
  background-color: #d32f2f;
  border: none;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #b71c1c;
    transform: scale(1.02);
  }

  @media (max-width: 480px) {
    margin-left: 0;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f8f8;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);

  button {
    background: none;
    border: none;
    color: #d32f2f;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 0.5rem;
    font-size: inherit;
    font-weight: 600;
  }
`;

const PizzasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

export default MenuPage;
