import { APP_BAR_SHOW } from "../actions/actionNames";

const appBarShow = (state = true, action) => {
	switch (action.type) {
		case APP_BAR_SHOW:
			return action.payload;
		default:
			return state;
	}
}
export default appBarShow;