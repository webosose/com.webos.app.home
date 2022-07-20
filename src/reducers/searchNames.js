import { SEARCH_NAME_UPDATE } from "../actions/actionNames";

const searchNames = (state = [], action) => {
	switch (action.type) {
		case SEARCH_NAME_UPDATE:
			return [...action.payload]
		default:
			return state;
	}
}
export default searchNames;