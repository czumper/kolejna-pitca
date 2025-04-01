import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchCategories, fetchPizzas } from "../features/menu/menuSlice";
import PizzaCard from "../components/menu/PizzaCard";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const MenuPage = () => {
  const dispatch = useDispatch();
  const { categories, pizzas, loading } = useSelector((state) => state.menu);

  // Filtering state
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  // On component mount, fetch categories and all pizzas
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPizzas());
  }, [dispatch]);

  // When filter criteria changes, fetch filtered pizzas
  useEffect(() => {
    const params = {};

    if (activeCategory !== "all") {
      params.category = activeCategory;
    }

    if (searchQuery) {
      params.search = searchQuery;
    }

    if (filters.vegetarian) {
      params.is_vegetarian = true;
    }

    if (filters.spicy) {
      params.is_spicy = true;
    }

    dispatch(fetchPizzas(params));
  }, [dispatch, activeCategory, searchQuery, filters]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setFilters({
      ...filters,
      [filter]: !filters[filter],
    });
  };

  const handleClearFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setFilters({
      vegetarian: false,
      spicy: false,
    });
  };

  // Check if any filters are active
  const isFiltering =
    activeCategory !== "all" ||
    searchQuery !== "" ||
    filters.vegetarian ||
    filters.spicy;

  return (
    <PageContainer>
      <MenuHeader>
        <h1>Menu</h1>
        <MenuSubtitle>
          Dobre pizze jedz!
        </MenuSubtitle>
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

        {isFiltering && (
          <ClearFiltersButton onClick={handleClearFilters}>
            <FaTimes /> Wyczyść filtry
          </ClearFiltersButton>
        )}
      </FiltersContainer>

      <CategoriesContainer>
        <CategoryButton
          active={activeCategory === "all"}
          onClick={() => handleCategoryChange("all")}
        >
          All
        </CategoryButton>

        {Array.isArray(categories) ? (
          categories.map((category) => (
            <CategoryButton
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </CategoryButton>
          ))
        ) : (
          <ErrorMessage>Dane kategorii są nieprawidłowe</ErrorMessage>
        )}
      </CategoriesContainer>

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
            <PizzaCard key={pizza.id} pizza={pizza} />
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
    margin-bottom: 0.5rem;
  }
`;

const MenuSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

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
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #d32f2f;
  }
`;

const FilterToggle = styled.button`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #d32f2f;
    color: #d32f2f;
  }
`;

const FiltersContainer = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 4px;
  align-items: center;

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
  cursor: pointer;
`;

const FilterLabel = styled.label`
  cursor: pointer;
`;

const ClearFiltersButton = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-left: auto;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    margin-left: 0;
  }
`;

const CategoriesContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
`;

const CategoryButton = styled.button`
  background-color: ${(props) => (props.active ? "#d32f2f" : "white")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: 1px solid ${(props) => (props.active ? "#d32f2f" : "#ddd")};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    border-color: #d32f2f;
    color: ${(props) => (props.active ? "white" : "#d32f2f")};
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
  border-radius: 8px;

  button {
    background: none;
    border: none;
    color: #d32f2f;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 0.5rem;
    font-size: inherit;
  }
`;

const PizzasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: red;
`;

export default MenuPage;
