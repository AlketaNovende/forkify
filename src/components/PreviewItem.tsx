import type { RecipePreview } from '../types/recipe';
import Icon from './Icon';

interface PreviewItemProps {
  recipe: RecipePreview;
  active?: boolean;
  onSelectRecipe: (id: string) => void;
}

export default function PreviewItem({ recipe, active = false, onSelectRecipe }: PreviewItemProps) {
  const linkClassName = active ? 'preview__link preview__link--active' : 'preview__link';

  return (
    <li className="preview">
      <a
        className={linkClassName}
        href={`#${recipe.id}`}
        onClick={event => {
          event.preventDefault();
          onSelectRecipe(recipe.id);
        }}
      >
        <figure className="preview__fig">
          <img src={recipe.image} alt={recipe.title} loading="lazy" />
        </figure>
        <div className="preview__data">
          <h4 className="preview__title" title={recipe.title}>
            {recipe.title}
          </h4>
          <p className="preview__publisher">{recipe.publisher}</p>
          {recipe.key && (
            <div className="preview__user-generated" title="User generated recipe">
              <Icon name="user" />
            </div>
          )}
        </div>
      </a>
    </li>
  );
}
