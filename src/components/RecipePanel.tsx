import type { Recipe } from '../types/recipe';
import { formatQuantity } from '../utils/format';
import Icon from './Icon';
import StatusMessage, { Spinner } from './StatusMessage';

interface RecipePanelProps {
  error: string | null;
  isBookmarked: boolean;
  isLoading: boolean;
  recipe: Recipe | null;
  onServingsChange: (servings: number) => void;
  onToggleBookmark: () => void;
}

export default function RecipePanel({
  error,
  isBookmarked,
  isLoading,
  recipe,
  onServingsChange,
  onToggleBookmark,
}: RecipePanelProps) {
  if (isLoading) {
    return (
      <main className="recipe">
        <Spinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="recipe">
        <StatusMessage variant="error" icon="alert-triangle">{error}</StatusMessage>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="recipe">
        <StatusMessage>Search for an ingredient or pick a saved recipe.</StatusMessage>
      </main>
    );
  }

  return (
    <main className="recipe">
      <figure className="recipe__fig">
        <img src={recipe.image} alt={recipe.title} className="recipe__img" />
        <h1 className="recipe__title">
          <span>{recipe.title}</span>
        </h1>
      </figure>

      <div className="recipe__details">
        <div className="recipe__info">
          <Icon name="clock" className="recipe__info-icon" />
          <span className="recipe__info-data recipe__info-data--minutes">{recipe.cookingTime}</span>
          <span className="recipe__info-text">minutes</span>
        </div>
        <div className="recipe__info">
          <Icon name="users" className="recipe__info-icon" />
          <span className="recipe__info-data recipe__info-data--people">{recipe.servings}</span>
          <span className="recipe__info-text">servings</span>

          <div className="recipe__info-buttons">
            <button
              className="btn--tiny"
              type="button"
              aria-label="Decrease servings"
              disabled={recipe.servings <= 1}
              onClick={() => onServingsChange(recipe.servings - 1)}
            >
              <Icon name="minus-circle" />
            </button>
            <button
              className="btn--tiny"
              type="button"
              aria-label="Increase servings"
              onClick={() => onServingsChange(recipe.servings + 1)}
            >
              <Icon name="plus-circle" />
            </button>
          </div>
        </div>

        {recipe.key && (
          <div className="recipe__user-generated" title="User generated recipe">
            <Icon name="user" />
          </div>
        )}
        <button
          className="btn--round"
          type="button"
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          onClick={onToggleBookmark}
        >
          <Icon name={isBookmarked ? 'bookmark-fill' : 'bookmark'} />
        </button>
      </div>

      <div className="recipe__ingredients">
        <h2 className="heading--2">Recipe ingredients</h2>
        <ul className="recipe__ingredient-list">
          {recipe.ingredients.map((ingredient, index) => (
            <li className="recipe__ingredient" key={`${ingredient.description}-${index}`}>
              <Icon name="check" className="recipe__icon" />
              <div className="recipe__quantity">{formatQuantity(ingredient.quantity)}</div>
              <div className="recipe__description">
                {ingredient.unit && <span className="recipe__unit">{ingredient.unit} </span>}
                {ingredient.description}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="recipe__directions">
        <h2 className="heading--2">How to cook it</h2>
        <p className="recipe__directions-text">
          This recipe was published by <span className="recipe__publisher">{recipe.publisher}</span>.
        </p>
        <a className="btn--small recipe__btn" href={recipe.sourceUrl} target="_blank" rel="noreferrer">
          <span>Directions</span>
          <Icon name="arrow-right" />
        </a>
      </div>
    </main>
  );
}
