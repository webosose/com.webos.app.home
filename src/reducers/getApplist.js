import { ADD_LAUNCH_POINT, GET_LAUNCH_POINTS, REMOVE_LAUNCH_POINT } from "../actions/actionNames";

const getApplist = (state = [], action) => {
	switch (action.type) {
		case GET_LAUNCH_POINTS:
			return [...action.payload];
		case ADD_LAUNCH_POINT:
			return [...state, action.payload]
		case REMOVE_LAUNCH_POINT:
			return state.filter((v)=>v.id !== action.payload)
		default:
			return state;
	}
};

export default getApplist;
