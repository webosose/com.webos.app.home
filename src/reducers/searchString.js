import { SEARCH_STRING } from "../actions/actionNames";

const searchString = (state = '', action) => {
	switch (action.type) {
		case SEARCH_STRING:
			return action.payload;
		default:
			return state;
	}
}
export default searchString;