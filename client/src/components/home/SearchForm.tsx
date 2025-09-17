type SearchFormProps = {
  city: string;
  setCity: (city: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

const SearchForm: React.FC<SearchFormProps> = ({ city, setCity, loading, onSubmit }) => (
  <form onSubmit={onSubmit} className="search-form">
    <div className="input-group">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Ej: Bogotá, Madrid, Tokyo..."
        disabled={loading}
      />
      <button type="submit" disabled={loading || !city.trim()}>
        {loading ? 'Buscando...' : 'Buscar Clima'}
      </button>
    </div>
  </form>
);

export default SearchForm;
