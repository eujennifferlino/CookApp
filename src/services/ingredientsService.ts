import { supabase } from "./supabase";

async function findByIds(ids: string[]) {
  const { data } = await supabase
    .from("ingredients")
    .select()
    .in("id", ids)
    .order("name")
    .returns<IngredientResponse[]>();

  return data ?? [];
}

async function findByRecipeId(id: string) {
  // Recupera os IDs dos ingredientes relacionados à receita
  const recipeIngredientsResponse = await supabase
    .from("recipes_ingredients")
    .select("ingredient_id")
    .eq("recipe_id", id);

  const recipeIngredientsIds =
    recipeIngredientsResponse.data?.map((item) => item.ingredient_id) ?? [];

  // Usar os IDs dos ingredientes para recuperar os detalhes dos ingredientes da tabela `ingredients`
  const { data: ingredientsData, error: ingredientsError } = await supabase
    .from("ingredients")
    .select("*")
    .in("id", recipeIngredientsIds)
    .order("name");

  if (ingredientsError) {
    console.error("Erro ao buscar os ingredientes:", ingredientsError.message);
    return [];
  }

  return ingredientsData ?? [];
}

async function findAll() {
  const { data } = await supabase
    .from("ingredients")
    .select()
    .order("name")
    .returns<IngredientResponse[]>();

  return data ?? [];
}

export { findAll, findByIds, findByRecipeId };
