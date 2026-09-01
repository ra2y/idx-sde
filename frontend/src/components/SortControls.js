import "./SortControls.css";

function SortControls({ sortBy, sortOrder, onSortChange }) {
  function handleFieldChange(event) {
    onSortChange(event.target.value, sortOrder);
  }

  function handleOrderChange(event) {
    onSortChange(sortBy, event.target.value);
  }

  return (
    <div className="sort-controls">
      <label>
        Sort by

        <select
          value={sortBy}
          onChange={handleFieldChange}
        >
          <option value="">Default</option>
          <option value="L_SystemPrice">Price</option>
          <option value="ListingContractDate">
            Date Listed
          </option>
          <option value="LM_Int2_3">
            Square Feet
          </option>
          <option value="L_Keyword2">
            Bedrooms
          </option>
        </select>
      </label>

      <label>
        Order

        <select
          value={sortOrder}
          onChange={handleOrderChange}
          disabled={!sortBy}
        >
          <option value="asc">
            Low to High / Oldest
          </option>

          <option value="desc">
            High to Low / Newest
          </option>
        </select>
      </label>
    </div>
  );
}

export default SortControls;