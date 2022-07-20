import { APP_BAR_NAMES } from "../actions/actionNames";

const appNames = (state = [], action) => {
	switch (action.type) {
		case APP_BAR_NAMES:
			return [...action.payload]
		default:
			return state;
	}
}
export default appNames;