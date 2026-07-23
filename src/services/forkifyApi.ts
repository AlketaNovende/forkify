import type { Ingredient, Recipe, RecipeFormFields, RecipePreview } from '../types/recipe';

const API_URL = 'https://forkify-api.jonas.io/api/v2/recipes/';
const TIMEOUT_SEC = 10;
const API_KEY = import.meta.env.VITE_FORKIFY_API_KEY?.trim() ?? '';

export const RESULTS_PER_PAGE = 10;

interface ForkifyIngredient {
  quantity: number | null;
  unit: string;
  description: string;
}

interface ForkifyRecipe {
  id: string;
  title: string;
  publisher: string;
  source_url?: string;
  image_url: string;
  servings?: number;
  cooking_time?: number;
  ingredients?: ForkifyIngredient[];
  key?: string;
}

interface ForkifyResponse<T> {
  status: string;
  data: T;
  message?: string;
}

interface SearchPayload {
  recipes: ForkifyRecipe[];
}

interface RecipePayload {
  recipe: ForkifyRecipe;
}

interface UploadRecipePayload {
  title: string;
  source_url: string;
  image_url: string;
  publisher: string;
  cooking_time: number;
  servings: number;
  ingredients: Ingredient[];
}

export const hasUploadApiKey = () => API_KEY.length > 0;

const timeout = (seconds: number) =>
  new Promise<never>((_, reject) => {
    window.setTimeout(() => {
      reject(new Error(`Request took too long. Timeout after ${seconds} seconds.`));
    }, seconds * 1000);
  });

const createRecipeUrl = (id = '', params: Record<string, string> = {}) => {
  const url = new URL(id, API_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  if (API_KEY) url.searchParams.set('key', API_KEY);

  return url.toString();
};

async function request<T>(url: string, uploadData?: unknown): Promise<T> {
  const fetchPromise = fetch(url, {
    method: uploadData ? 'POST' : 'GET',
    headers: uploadData ? { 'Content-Type': 'application/json' } : undefined,
    body: uploadData ? JSON.stringify(uploadData) : undefined,
  });

  const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
  const payload = (await response.json()) as ForkifyResponse<T>;

  if (!response.ok) {
    throw new Error(payload.message ?? `Forkify request failed (${response.status}).`);
  }

  return payload.data;
}

const mapRecipe = (recipe: ForkifyRecipe): Recipe => ({
  id: recipe.id,
  title: recipe.title,
  publisher: recipe.publisher,
  sourceUrl: recipe.source_url ?? '#',
  image: recipe.image_url,
  servings: recipe.servings ?? 1,
  cookingTime: recipe.cooking_time ?? 0,
  ingredients: recipe.ingredients ?? [],
  ...(recipe.key && { key: recipe.key }),
});

const mapRecipePreview = (recipe: ForkifyRecipe): RecipePreview => ({
  id: recipe.id,
  title: recipe.title,
  publisher: recipe.publisher,
  image: recipe.image_url,
  ...(recipe.key && { key: recipe.key }),
});

const parseNumberField = (value: string, label: string) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }

  return number;
};

const parseIngredients = (fields: RecipeFormFields): Ingredient[] => {
  const ingredients = Object.entries(fields)
    .filter(([key, value]) => key.startsWith('ingredient') && value.trim())
    .map(([key, value]) => {
      const parts = value.split(',').map(part => part.trim());

      if (parts.length !== 3) {
        throw new Error(`${key} must use: quantity,unit,description.`);
      }

      const [quantityText, unit, description] = parts;
      const parsedQuantity = quantityText ? Number(quantityText) : null;

      if (parsedQuantity !== null && (!Number.isFinite(parsedQuantity) || parsedQuantity < 0)) {
        throw new Error(`${key} quantity must be zero or higher.`);
      }

      if (!description) {
        throw new Error(`${key} needs a description.`);
      }

      return { quantity: parsedQuantity, unit, description };
    });

  if (!ingredients.length) {
    throw new Error('Add at least one ingredient.');
  }

  return ingredients;
};

export async function searchRecipes(query: string): Promise<RecipePreview[]> {
  const payload = await request<SearchPayload>(createRecipeUrl('', { search: query }));
  return payload.recipes.map(mapRecipePreview);
}

export async function getRecipe(id: string): Promise<Recipe> {
  const payload = await request<RecipePayload>(createRecipeUrl(id));
  return mapRecipe(payload.recipe);
}

export async function uploadRecipe(fields: RecipeFormFields): Promise<Recipe> {
  if (!API_KEY) {
    throw new Error('Add VITE_FORKIFY_API_KEY to your environment before uploading recipes.');
  }

  const recipePayload: UploadRecipePayload = {
    title: fields.title.trim(),
    source_url: fields.sourceUrl.trim(),
    image_url: fields.image.trim(),
    publisher: fields.publisher.trim(),
    cooking_time: parseNumberField(fields.cookingTime, 'Prep time'),
    servings: parseNumberField(fields.servings, 'Servings'),
    ingredients: parseIngredients(fields),
  };

  const payload = await request<RecipePayload>(createRecipeUrl(), recipePayload);
  return mapRecipe(payload.recipe);
}
