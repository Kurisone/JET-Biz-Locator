// Helper function to get CSRF token
const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Action Types
const LOAD_ALL_BUSINESSES = 'businesses/LOAD_ALL_BUSINESSES';
const ADD_BUSINESS = 'businesses/ADD_BUSINESS';
const UPDATE_BUSINESS = 'businesses/UPDATE_BUSINESS';
const DELETE_BUSINESS = 'businesses/DELETE_BUSINESS';

// These are Action Creators for businesses
const loadBusinesses = (businesses) => ({
  type: LOAD_ALL_BUSINESSES,
  businesses
});

const addBusiness = (business) => ({
  type: ADD_BUSINESS,
  business
});

const updateBusinessAction = (business) => ({
  type: UPDATE_BUSINESS,
  business
});

const deleteBusinessAction = (businessId) => ({
  type: DELETE_BUSINESS,
  businessId
});

// Thunk Action
export const fetchAllBusinesses = () => async (dispatch) => {
  //const response = await fetch('/api/businesses');
  const response = await fetch('/api/businesses/');

  if (response.ok) {
    const data = await response.json();
    dispatch(loadBusinesses(data.businesses));
    return data;
  }
};

// thunk for create business
export const createBusiness = (businessData) => async (dispatch) => {
  const response = await fetch('/api/businesses/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken()
    },
    credentials: 'include',
    body: JSON.stringify(businessData)
  });

  if (response.ok) {
    const newBusiness = await response.json();
    dispatch(addBusiness(newBusiness));
    return newBusiness;
  } else {
    const errors = await response.json();
    throw new Error(errors.message || 'Failed to create business');
  }
};

// thunk for update business
export const updateBusiness = (businessId, businessData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/businesses/${businessId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken()
      },
      credentials: 'include',
      body: JSON.stringify(businessData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update business');
    }

    const updatedBusiness = await response.json();
    dispatch(updateBusinessAction(updatedBusiness));
    return updatedBusiness;
  } catch (error) {
    console.error('Error updating business:', error);
    throw error;
  }
};

// thunk for delete business
export const deleteBusiness = (businessId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/businesses/${businessId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCsrfToken()
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete business');
    }

    dispatch(deleteBusinessAction(businessId));
    return true;
  } catch (error) {
    console.error('Error deleting business:', error);
    throw error;
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
    case ADD_BUSINESS: {
      const newState = { ...state };
      newState.allBusinesses = {
        ...newState.allBusinesses,
        [action.business.id]: action.business
    };
      return newState;
    }
    case UPDATE_BUSINESS: {
        return {
          ...state,
          allBusinesses: {
            ...state.allBusinesses,
            [action.business.id]: action.business
          }
        };
    }
    case DELETE_BUSINESS: {
      const newState = { ...state };
      const newBusinesses = { ...newState.allBusinesses };
      delete newBusinesses[action.businessId];
      newState.allBusinesses = newBusinesses;
      return newState;
    }
    default:
      return state;
  }
};
