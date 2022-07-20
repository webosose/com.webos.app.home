import { RUNNING_APPS } from "../actions/actionNames";

const runningApps = (state = [], action) => {
	switch (action.type) {
		case RUNNING_APPS:
			return [...action.payload];
		default:
			return state;
	}
};

export default runningApps;
