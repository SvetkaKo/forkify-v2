import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helper.js';

export const state = {
  recipe: {},
  serch: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      courceUrl: recipe.source_url,
      img: recipe.image_url,
      servings: recipe.servings,
      cooking_time: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

export const loadSerchResults = async function (query) {
  try {
    state.serch.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    state.serch.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        img: rec.image_url,
      };
    });
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

//show recipes for current page
export const getSearhResultsPage = function (page = state.serch.page) {
  state.serch.page = page;
  const start = (page - 1) * state.serch.resultPerPage; // 0
  const end = page * state.serch.resultPerPage; // 10

  return state.serch.results.slice(start, end);
};

export const updateServings = function (newServ) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServ;
  });

  state.recipe.servings = newServ;
};
