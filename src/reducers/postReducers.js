import {
	POST_CREATE_REQUEST,
	POST_CREATE_SUCCESS,
	POST_CREATE_FAIL,
	POST_CREATE_RESET,
	POST_LIST_REQUEST,
	POST_LIST_SUCCESS,
	POST_LIST_FAIL,
	UPDATE_LIKES,
	ADD_COMMENT,
	DELETE_POST_REQUEST,
	DELETE_POST_SUCCESS,
	LOAD_UPDATE_LIKES
} from "../types/postTypes";

//Reducer for createing a post
export const postCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case POST_CREATE_REQUEST:
			return { loading: true };
		case POST_CREATE_SUCCESS:
			return { loading: false, success: true, post: action.payload };
		case POST_CREATE_FAIL:
			return { loading: false, error: action.payload };
		case POST_CREATE_RESET:
			return {};
		default:
			return state;
	}
};

//Reducer for product list in home screen
export const postListReducer = (state = { posts: [] }, action) => {
	switch (action.type) {
		case POST_LIST_REQUEST:
			return { loading: true, posts: [] };
		case POST_LIST_SUCCESS:
			return {
				loading: false,
				posts: action.payload,
			};
		case POST_LIST_FAIL:
			return { ...state, loading: false, error: action.payload };
		case LOAD_UPDATE_LIKES:
			return { ...state, loadingLikes: true };
		case UPDATE_LIKES:
			return {
				...state,
				posts: state.posts.map((post) =>
					post._id === action.payload.id
						? { ...post, likes: action.payload.likes }
						: post
				),
				loadingLikes: false
			};
		case ADD_COMMENT:
			return {
				...state,
				posts: state.posts.map((post) =>
					post._id === action.payload.postId
						? { ...post, comments: action.payload.comments }
						: post
				),
			};
		case DELETE_POST_REQUEST:
			return { ...state, loading: true };
		case DELETE_POST_SUCCESS:
			return {
				...state,
				posts: state.posts.filter(
					(post) => post._id !== action.payload
				),
				loading: false,
			};
		default:
			return state;
	}
};
