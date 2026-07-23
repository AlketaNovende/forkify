export interface Ingredient {
  quantity: number | null;
  unit: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  publisher: string;
  sourceUrl: string;
  image: string;
  servings: number;
  cookingTime: number;
  ingredients: Ingredient[];
  key?: string;
}

export type RecipePreview = Pick<
  Recipe,
  'id' | 'title' | 'publisher' | 'image' | 'key'
>;

export interface RecipeFormFields {
  title: string;
  sourceUrl: string;
  image: string;
  publisher: string;
  cookingTime: string;
  servings: string;
  [key: string]: string;
}
