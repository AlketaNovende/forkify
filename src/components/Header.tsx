import { useState, type FormEvent } from 'react';
import logo from '../img/logo.png';
import type { RecipePreview } from '../types/recipe';
import Icon from './Icon';
import PreviewItem from './PreviewItem';
import StatusMessage from './StatusMessage';

interface HeaderProps {
  bookmarks: RecipePreview[];
  isSearching: boolean;
  selectedRecipeId: string | null;
  onOpenAddRecipe: () => void;
  onSearch: (query: string) => void;
  onSelectRecipe: (id: string) => void;
}

export default function Header({
  bookmarks,
  isSearching,
  selectedRecipeId,
  onOpenAddRecipe,
  onSearch,
  onSelectRecipe,
}: HeaderProps) {
  const [query, setQuery] = useState('pizza');
  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <header className="header">
      <img src={logo} alt="Forkify" className="header__logo" />

      <form className="search" onSubmit={handleSubmit}>
        <input
          type="search"
          className="search__field"
          placeholder="Search recipes or ingredients..."
          value={query}
          onChange={event => setQuery(event.target.value)}
          aria-label="Search recipes"
        />
        <button className="btn search__btn" type="submit" disabled={isSearching}>
          <Icon name="search" />
          <span>{isSearching ? 'Searching' : 'Search'}</span>
        </button>
      </form>

      <nav className="nav" aria-label="Recipe actions">
        <ul className="nav__list">
          <li className="nav__item">
            <button className="nav__btn nav__btn--add-recipe" type="button" onClick={onOpenAddRecipe}>
              <Icon name="edit" className="nav__icon" />
              <span>Add recipe</span>
            </button>
          </li>
          <li className="nav__item">
            <button
              className="nav__btn nav__btn--bookmarks"
              type="button"
              aria-expanded={bookmarksOpen}
              onClick={() => setBookmarksOpen(open => !open)}
            >
              <Icon name="bookmark" className="nav__icon" />
              <span>Bookmarks</span>
              <span className="bookmark-count">{bookmarks.length}</span>
            </button>
            <div className={bookmarksOpen ? 'bookmarks bookmarks--visible' : 'bookmarks'}>
              {bookmarks.length ? (
                <ul className="bookmarks__list">
                  {bookmarks.map(bookmark => (
                    <PreviewItem
                      key={bookmark.id}
                      recipe={bookmark}
                      active={bookmark.id === selectedRecipeId}
                      onSelectRecipe={id => {
                        onSelectRecipe(id);
                        setBookmarksOpen(false);
                      }}
                    />
                  ))}
                </ul>
              ) : (
                <StatusMessage>No bookmarks yet. Save a recipe you want to cook later.</StatusMessage>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
