
export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        aria-label="Search invoices"
      />
    </div>
  );
}
