// Action Types - redux needs a type to know what action is being dispatched so the reducer can respond accordingly


const ADD_REVIEW = 'reviews/Add_REVIEW'; // add a new review to state
const SET_REVIEWS = 'reviews/SET_REVIEWS'; // for loading all reviews

// Action  creators - returns an action object that describes what happened
// need it to actually update the Redux store with the new review data

const addReview = (review) => ({ // Action to add a review
    type: ADD_Review,
    review
});

const setReviews = (reviews) => ({ // action creator
    type: SET_REVIEWS,
    reviews
  });

// Thunk to create a new review - THIS sends the review to your backend using a POST request.
// If successful, it dispatches the addReview action to update the REDUX state.
// REDUX can't handle async logic(like fetch) directly. you neeed a thunk to perform the async request,
// then dispatch a regular action with the result.

export const createReview = (businessId, payload) => async (dispatch) => {
    const res = await fetch(`/api/reviews/businesses/${businessId}/reviews`, { // POST to backend
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
        const data = await res.json(); // get newly created review
        dispatch(addReview(data)); // add it to Redux store
        return data;
    } else {
        throw res; // let component catch and handle error
    }
};

// fetches ALL REVIEWS for a specific BUSINESS from the backend and stores them in REDUX (by review ID) 
export const getReviewsByBusinessId = (businessId) => async (dispatch) => {
    const res = await fetch(`/api/reviews/businesses/${businessId}/reviews`); // GET request to backend
  
    if (res.ok) {
      const data = await res.json(); // get JSON response
  
      const normalized = {}; // normalize array into object by id
      data.reviews.forEach(review => {
        normalized[review.id] = review;
      });
  
      dispatch(setReviews(normalized)); // update Redux store with reviews
    } else {
      throw res; // let component catch error if needed
    }
  };

// Initial state
// All Redux reducers need an initial state to return on first load.
// This ensures reviews start as an empty object

const initialState = {}; // Reviews stored by id

// Reducer - listens for the ADD_REVIEW action. when it sees it, it adds the new review to the REDUX
// state using its ID as the key
// Reducers are how Redux actually stores and updates the state in response to actions.

export default function reviewsReducer(state = initialState, action) {
    switch (action.type) {
      case ADD_REVIEW: {
        const newState = { ...state };     // copy existing state
        newState[action.review.id] = action.review; // add new review by ID
        return newState;
      }
      case SET_REVIEWS: {
        return { ...action.reviews }; // replace all reviews with new set
      }
      default:
        return state; // return unchanged state for other actions
    }
  }