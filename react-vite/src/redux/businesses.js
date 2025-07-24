// Action Types
const LOAD_ALL_BUSINESSES = 'businesses/LOAD_ALL_BUSINESSES';

// These are Action Creators for businesses
const loadBusinesses = (businesses) => ({
  type: LOAD_ALL_BUSINESSES,
  businesses
});

// Thunk Action
export const fetchAllBusinesses = () => async (dispatch) => {
  const response = await fetch('/api/businesses');

  if (response.ok) {
    const data = await response.json();
    dispatch(loadBusinesses(data.businesses));
    return data;
  }
};

// Initial State
const initialState = {
  allBusinesses: {}
};

// Reducer
export const businessesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_BUSINESSES: {
      const newState = { ...state };
      const businessesObj = {};
      action.businesses.forEach(business => {
        businessesObj[business.id] = business;
      });
      newState.allBusinesses = businessesObj;
      return newState;
    }
    default:
      return state;
  }
};
