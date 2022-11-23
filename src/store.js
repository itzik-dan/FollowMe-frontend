import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
	userLoginReducer,
	userRegisterReducer,
	userListReducer,
} from "./reducers/userReducers";
import { postCreateReducer, postListReducer } from "./reducers/postReducers";

const reducer = combineReducers({
	userLogin: userLoginReducer,
	userRegister: userRegisterReducer,
	postCreate: postCreateReducer,
	postList: postListReducer,
	userList: userListReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
	? JSON.parse(localStorage.getItem("userInfo"))
	: null;

const initialState = {
	userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

// Store setup
const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
