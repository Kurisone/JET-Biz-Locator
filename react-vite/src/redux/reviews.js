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
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const SET_REVIEWS = 'reviews/SET_REVIEWS';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const ADD_IMAGE = 'reviews/ADD_IMAGE';

// Action Creators
const addReview = (review) => ({
  type: ADD_REVIEW,
  review
});

const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  reviews
});

const addImage = (reviewId, image) => ({
  type: ADD_IMAGE,
  reviewId,
  image
});

const deleteReviewAction = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId
});

// Thunks
export const createReview = (businessId, payload) => async (dispatch) => {
  try {
    const response = await fetch(`/api/businesses/${businessId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken()
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Handle non-2xx responses
      const errorData = await response.text(); // First try to read as text
      try {
        // If it's JSON, parse it
        return { error: JSON.parse(errorData) };
      } catch {
        // If not JSON, return the raw text
        return { error: errorData };
      }
    }

    const data = await response.json();
    dispatch({ type: ADD_REVIEW, review: data });
    return data; // Return the created review data

  } catch (error) {
    console.error('Create review error:', error);
    return { error: error.message };
  }
};

export const uploadReviewImage = (reviewId, imageData) => async (dispatch) => {
  const response = await fetch(`/api/review-images/${reviewId}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken()
    },
    credentials: 'include',
    body: JSON.stringify(imageData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addImage(reviewId, data));
    return data;
  } else {
    const error = await response.json();
    throw error;
  }
};

export const getReviewsByBusinessId = (businessId) => async (dispatch) => {
  const response = await fetch(`/api/businesses/${businessId}/reviews`, {
    credentials: 'include'
  });

  if (response.ok) {
    const data = await response.json();

    const normalized = {};
    data.reviews.forEach(review => {
      normalized[review.id] = review;
    });

    dispatch(setReviews(normalized));
    return data;
  } else {
    const error = await response.json();
    throw error;
  }
};

export const updateReview = (reviewId, payload) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken()
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addReview(data));
    return data;
  } else {
    const error = await response.json();
    throw error;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken()
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete review');
    }

    const data = await response.json();
    dispatch(deleteReviewAction(data.reviewId));
    return data;

  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

// Reducer
const initialState = {};

export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_REVIEW:
      return {
        ...state,
        [action.review.id]: {
          ...action.review,
          images: action.review.images || []
        }
      };
    
    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    }
    
    case SET_REVIEWS:
      return { ...action.reviews };
    
    case ADD_IMAGE:
      return {
        ...state,
        [action.reviewId]: {
          ...state[action.reviewId],
          images: [...(state[action.reviewId]?.images || []), action.image]
        }
      };
    
    default:
      return state;
  }
}