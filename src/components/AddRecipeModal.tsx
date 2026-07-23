import { useEffect, type FormEvent } from 'react';
import type { RecipeFormFields } from '../types/recipe';
import Icon from './Icon';
import StatusMessage from './StatusMessage';

interface AddRecipeModalProps {
  canUpload: boolean;
  error: string | null;
  isOpen: boolean;
  isUploading: boolean;
  successMessage: string | null;
  onClose: () => void;
  onSubmit: (fields: RecipeFormFields) => Promise<boolean>;
}

const INGREDIENT_FIELDS = Array.from({ length: 6 }, (_, index) => index + 1);

export default function AddRecipeModal({
  canUpload,
  error,
  isOpen,
  isUploading,
  successMessage,
  onClose,
  onSubmit,
}: AddRecipeModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fields = Object.fromEntries(
      [...formData.entries()].map(([key, value]) => [key, String(value)])
    ) as RecipeFormFields;

    const wasUploaded = await onSubmit(fields);
    if (wasUploaded) form.reset();
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="add-recipe-window" role="dialog" aria-modal="true" aria-labelledby="add-recipe-title">
        <button className="btn--close-modal" type="button" aria-label="Close modal" onClick={onClose}>
          &times;
        </button>

        <form className="upload" onSubmit={handleSubmit}>
          <div className="upload__column">
            <h3 className="upload__heading" id="add-recipe-title">
              Recipe data
            </h3>
            <label htmlFor="title">Title</label>
            <input id="title" required name="title" type="text" />
            <label htmlFor="sourceUrl">URL</label>
            <input id="sourceUrl" required name="sourceUrl" type="url" />
            <label htmlFor="image">Image URL</label>
            <input id="image" required name="image" type="url" />
            <label htmlFor="publisher">Publisher</label>
            <input id="publisher" required name="publisher" type="text" />
            <label htmlFor="cookingTime">Prep time</label>
            <input id="cookingTime" required name="cookingTime" type="number" min="1" />
            <label htmlFor="servings">Servings</label>
            <input id="servings" required name="servings" type="number" min="1" />
          </div>

          <div className="upload__column">
            <h3 className="upload__heading">Ingredients</h3>
            {INGREDIENT_FIELDS.map(fieldNumber => (
              <div className="upload__field-group" key={fieldNumber}>
                <label htmlFor={`ingredient-${fieldNumber}`}>Ingredient {fieldNumber}</label>
                <input
                  id={`ingredient-${fieldNumber}`}
                  type="text"
                  required={fieldNumber === 1}
                  name={`ingredient-${fieldNumber}`}
                  placeholder="Quantity,Unit,Description"
                />
              </div>
            ))}
          </div>

          {!canUpload && (
            <div className="upload__status">
              <StatusMessage variant="error" icon="alert-triangle">
                Add a VITE_FORKIFY_API_KEY value before uploading recipes.
              </StatusMessage>
            </div>
          )}
          {error && (
            <div className="upload__status">
              <StatusMessage variant="error" icon="alert-triangle">{error}</StatusMessage>
            </div>
          )}
          {successMessage && (
            <div className="upload__status">
              <StatusMessage icon="check">{successMessage}</StatusMessage>
            </div>
          )}

          <button className="btn upload__btn" type="submit" disabled={isUploading || !canUpload}>
            <Icon name="upload-cloud" />
            <span>{isUploading ? 'Uploading' : 'Upload'}</span>
          </button>
        </form>
      </div>
    </>
  );
}
