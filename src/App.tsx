import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import SearchResults from './components/SearchResults';
import RecipePanel from './components/RecipePanel';
import AddRecipeModal from './components/AddRecipeModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  getRecipe,
  hasUploadApiKey,
  RESULTS_PER_PAGE,
  searchRecipes,
  uploadRecipe,
} from './services/forkifyApi';
import type { Recipe, RecipeFormFields, RecipePreview } from './types/recipe';
import { getErrorMessage, getVisibleResults } from './utils/format';

interface SearchState {
  query: string;
  results: RecipePreview[];
  page: number;
  resultsPerPage: number;
}

interface UploadState {
  isUploading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialSearchState: SearchState = {
  query: '',
  results: [],
  page: 1,
  resultsPerPage: RESULTS_PER_PAGE,
};

const initialUploadState: UploadState = {
  isUploading: false,
  error: null,
  successMessage: null,
};

const toRecipePreview = (recipe: Recipe): RecipePreview => ({
  id: recipe.id,
  title: recipe.title,
  publisher: recipe.publisher,
  image: recipe.image,
  ...(recipe.key && { key: recipe.key }),
});

export default function App() {
  const [bookmarks, setBookmarks] = useLocalStorage<RecipePreview[]>('forkify-bookmarks', []);
  const [search, setSearch] = useState<SearchState>(initialSearchState);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeError, setRecipeError] = useState<string | null>(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>(initialUploadState);

  const visibleResults = useMemo(
    () => getVisibleResults(search.results, search.page, search.resultsPerPage),
    [search.page, search.results, search.resultsPerPage]
  );

  const isCurrentRecipeBookmarked = Boolean(
    recipe && bookmarks.some(bookmark => bookmark.id === recipe.id)
  );

  const selectRecipe = (id: string) => {
    setSelectedRecipeId(id);

    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, '', `#${id}`);
    }
  };

  useEffect(() => {
    const syncRecipeIdFromHash = () => {
      setSelectedRecipeId(window.location.hash.replace('#', '') || null);
    };

    syncRecipeIdFromHash();
    window.addEventListener('hashchange', syncRecipeIdFromHash);
    window.addEventListener('popstate', syncRecipeIdFromHash);

    return () => {
      window.removeEventListener('hashchange', syncRecipeIdFromHash);
      window.removeEventListener('popstate', syncRecipeIdFromHash);
    };
  }, []);

  useEffect(() => {
    if (!selectedRecipeId) {
      setRecipe(null);
      setRecipeError(null);
      return;
    }

    const recipeId = selectedRecipeId;
    let isActive = true;

    async function loadSelectedRecipe() {
      try {
        setIsRecipeLoading(true);
        setRecipeError(null);
        const nextRecipe = await getRecipe(recipeId);

        if (isActive) setRecipe(nextRecipe);
      } catch (error) {
        if (isActive) {
          setRecipe(null);
          setRecipeError(getErrorMessage(error));
        }
      } finally {
        if (isActive) setIsRecipeLoading(false);
      }
    }

    void loadSelectedRecipe();

    return () => {
      isActive = false;
    };
  }, [selectedRecipeId]);

  const handleSearch = async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) return;

    try {
      setIsSearching(true);
      setSearchError(null);
      setSearch({ ...initialSearchState, query });

      const results = await searchRecipes(query);

      setSearch({
        query,
        results,
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE,
      });

      if (results.length > 0) selectRecipe(results[0].id);
    } catch (error) {
      setSearch({
        query,
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE,
      });
      setSearchError(getErrorMessage(error));
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (page: number) => {
    setSearch(currentSearch => ({ ...currentSearch, page }));
  };

  const handleServingsChange = (servings: number) => {
    if (!recipe || servings < 1) return;

    setRecipe(currentRecipe => {
      if (!currentRecipe) return currentRecipe;

      return {
        ...currentRecipe,
        servings,
        ingredients: currentRecipe.ingredients.map(ingredient => ({
          ...ingredient,
          quantity:
            ingredient.quantity === null
              ? null
              : (ingredient.quantity * servings) / currentRecipe.servings,
        })),
      };
    });
  };

  const handleToggleBookmark = () => {
    if (!recipe) return;

    const preview = toRecipePreview(recipe);

    setBookmarks(currentBookmarks => {
      if (currentBookmarks.some(bookmark => bookmark.id === recipe.id)) {
        return currentBookmarks.filter(bookmark => bookmark.id !== recipe.id);
      }

      return [preview, ...currentBookmarks];
    });
  };

  const openAddRecipeModal = () => {
    setUploadState(initialUploadState);
    setIsAddRecipeOpen(true);
  };

  const handleUploadRecipe = async (fields: RecipeFormFields) => {
    try {
      setUploadState({ isUploading: true, error: null, successMessage: null });

      const uploadedRecipe = await uploadRecipe(fields);
      const preview = toRecipePreview(uploadedRecipe);

      setRecipe(uploadedRecipe);
      setBookmarks(currentBookmarks => [
        preview,
        ...currentBookmarks.filter(bookmark => bookmark.id !== uploadedRecipe.id),
      ]);
      selectRecipe(uploadedRecipe.id);
      setUploadState({
        isUploading: false,
        error: null,
        successMessage: 'Recipe uploaded and bookmarked.',
      });

      window.setTimeout(() => {
        setIsAddRecipeOpen(false);
        setUploadState(initialUploadState);
      }, 1800);

      return true;
    } catch (error) {
      setUploadState({
        isUploading: false,
        error: getErrorMessage(error),
        successMessage: null,
      });

      return false;
    }
  };

  return (
    <>
      <div className="container">
        <Header
          bookmarks={bookmarks}
          isSearching={isSearching}
          selectedRecipeId={selectedRecipeId}
          onOpenAddRecipe={openAddRecipeModal}
          onSearch={handleSearch}
          onSelectRecipe={selectRecipe}
        />
        <SearchResults
          currentPage={search.page}
          error={searchError}
          isLoading={isSearching}
          query={search.query}
          results={search.results}
          resultsPerPage={search.resultsPerPage}
          selectedRecipeId={selectedRecipeId}
          visibleResults={visibleResults}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onSelectRecipe={selectRecipe}
        />
        <RecipePanel
          error={recipeError}
          isBookmarked={isCurrentRecipeBookmarked}
          isLoading={isRecipeLoading}
          recipe={recipe}
          onServingsChange={handleServingsChange}
          onToggleBookmark={handleToggleBookmark}
        />
      </div>

      <AddRecipeModal
        canUpload={hasUploadApiKey()}
        error={uploadState.error}
        isOpen={isAddRecipeOpen}
        isUploading={uploadState.isUploading}
        successMessage={uploadState.successMessage}
        onClose={() => setIsAddRecipeOpen(false)}
        onSubmit={handleUploadRecipe}
      />
    </>
  );
}
