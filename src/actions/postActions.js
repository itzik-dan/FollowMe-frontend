import axios from "axios";
import {
	POST_CREATE_REQUEST,
	POST_CREATE_SUCCESS,
	POST_CREATE_FAIL,
	POST_LIST_REQUEST,
	POST_LIST_SUCCESS,
	POST_LIST_FAIL,
	UPDATE_LIKES,
	ADD_COMMENT,
	DELETE_POST_REQUEST,
	DELETE_POST_SUCCESS,
	LOAD_UPDATE_LIKES
} from "../types/postTypes";
import { toast } from "react-toastify";

// Action for creating a post
export const createPost = (title, body, photo) => async (
	dispatch,
	getState
) => {
	try {
		dispatch({
			type: POST_CREATE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.post(
			`/createpost`,
			{ title, body, photo },
			config
		);

		dispatch({
			type: POST_CREATE_SUCCESS,
			payload: data,
		});
		dispatch(listPosts());
		toast.success("Post Added");
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		if (message === "Cannot read property 'token' of null") {
			document.location.href = "/login";
		} else {
			toast.error(message);
		}

		dispatch({
			type: POST_CREATE_FAIL,
			payload: message,
		});
	}
};

// Action for fetching all db posts
export const listPosts = () => async (dispatch) => {
	try {
		dispatch({ type: POST_LIST_REQUEST });

		const { data } = await axios.get("/allpost");

		dispatch({
			type: POST_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: POST_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// Action for fetching all db posts
export const listFollowingPosts = () => async (dispatch, getState) => {
	try {
		dispatch({ type: POST_LIST_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		const { data } = await axios.get("/followingPosts", {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		});

		dispatch({
			type: POST_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: POST_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// Add like
export const addLike = (id) => async (dispatch, getState) => {
	try {
		const {
			userLogin: { userInfo },
		} = getState();

		dispatch({type: LOAD_UPDATE_LIKES});

		const { data } = await axios.put(
			"/like",
			{ postId: id },
			{
				headers: {
					Authorization: `Bearer ${userInfo.token}`,
				},
			}
		);
		dispatch({
			type: UPDATE_LIKES,
			payload: { id, likes: data.likes },
		});
	} catch (error) {
		dispatch({
			type: POST_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// Remove like
export const removeLike = (id) => async (dispatch, getState) => {
	try {
		const {
			userLogin: { userInfo },
		} = getState();

		dispatch({type: LOAD_UPDATE_LIKES});

		const { data } = await axios.put(
			"/unlike",
			{ postId: id },
			{
				headers: {
					Authorization: `Bearer ${userInfo.token}`,
				},
			}
		);
		dispatch({
			type: UPDATE_LIKES,
			payload: { id, likes: data.likes },
		});
	} catch (error) {
		dispatch({
			type: POST_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// Add comment
export const addComment = (postId, text) => async (dispatch, getState) => {
	try {
		const {
			userLogin: { userInfo },
		} = getState();

		const { data } = await axios.put(
			"/comment",
			{ postId, text },
			{
				headers: {
					Authorization: `Bearer ${userInfo.token}`,
				},
			}
		);

		dispatch({
			type: ADD_COMMENT,
			payload: { postId, comments: data.comments },
		});

		toast.success("Comment Added");
	} catch (error) {
		dispatch({
			type: POST_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// Action for deleting single post
export const deletePost = (postId) => async (dispatch, getState) => {
	try {
		dispatch({
			type: DELETE_POST_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		await axios.delete(`/deletepost/${postId}`, config);

		dispatch({
			type: DELETE_POST_SUCCESS,
			payload: postId,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		dispatch({
			type: POST_LIST_FAIL,
			payload: message,
		});
	}
};
