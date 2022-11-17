import { SHOW_FEEDBACK, HIDE_FEEDBACK } from "../actions/actionNames";

const appFeedback = (state = {show:false}, action) => {
	switch (action.type) {
		case SHOW_FEEDBACK:
			return {...state,...action.payload}
		case HIDE_FEEDBACK:
			return {}
		default:
			return state;
	}
}
export default appFeedback;