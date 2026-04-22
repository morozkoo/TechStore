function PriceFilter({ minPrice, maxPrice, onMinChange, onMaxChange }) {
  return (
    <div className="price-filter">
      <h4>Фильтр по цене</h4>
      <input
        type="number"
        placeholder="От"
        value={minPrice}
        onChange={(e) => onMinChange(e.target.value)}
      />
      <input
        type="number"
        placeholder="До"
        value={maxPrice}
        onChange={(e) => onMaxChange(e.target.value)}
      />
    </div>
  );
}

export default PriceFilter;
