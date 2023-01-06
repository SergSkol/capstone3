const initialState = {};

const GET_CATEGORIES = 'capstone3/categories/GET_CATEGORIES';

// Reducer
export default function categoriesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_CATEGORIES:
      const { categories } = action;
      return { ...state, categories };
    default:
      return state;
  }
}

// Action Creators
export function getCategoriesAction(categories) {
  return { type: GET_CATEGORIES, categories };
}
