import type { RecipePreview } from '../types/recipe';
import PreviewItem from './PreviewItem';
import Pagination from './Pagination';
import StatusMessage, { Spinner } from './StatusMessage';

const QUICK_SEARCHES = ['pizza', 'pasta', 'salad', 'chicken'];

interface SearchResultsProps {
  currentPage: number;
  error: string | null;
  isLoading: boolean;
  query: string;
  results: RecipePreview[];
  resultsPerPage: number;
  selectedRecipeId: string | null;
  visibleResults: RecipePreview[];
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onSelectRecipe: (id: string) => void;
}

export default function SearchResults({
  currentPage,
  error,
  isLoading,
  query,
  results,
  resultsPerPage,
  selectedRecipeId,
  visibleResults,
  onPageChange,
  onSearch,
  onSelectRecipe,
}: SearchResultsProps) {
  return (
    <aside className="search-results">
      {!query && !isLoading && (
        <div className="quick-searches">
          <p className="quick-searches__label">Try a popular search</p>
          <div className="quick-searches__list">
            {QUICK_SEARCHES.map(item => (
              <button className="query-chip" type="button" key={item} onClick={() => onSearch(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && !isLoading && !error && (
        <div className="results__summary">
          <strong>{results.length}</strong>
          <span>{results.length === 1 ? ' recipe' : ' recipes'} for {query}</span>
        </div>
      )}

      {isLoading && <Spinner />}
      {error && <StatusMessage variant="error" icon="alert-triangle">{error}</StatusMessage>}

      {!isLoading && !error && visibleResults.length > 0 && (
        <ul className="results">
          {visibleResults.map(recipe => (
            <PreviewItem
              key={recipe.id}
              recipe={recipe}
              active={recipe.id === selectedRecipeId}
              onSelectRecipe={onSelectRecipe}
            />
          ))}
        </ul>
      )}

      <Pagination
        currentPage={currentPage}
        resultsCount={results.length}
        resultsPerPage={resultsPerPage}
        onPageChange={onPageChange}
      />

      <p className="copyright">
        Recipe data from{' '}
        <a className="twitter-link" target="_blank" rel="noreferrer" href="https://forkify-api.jonas.io">
          Forkify API
        </a>
        .
      </p>
    </aside>
  );
}
