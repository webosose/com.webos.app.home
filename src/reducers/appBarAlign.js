import { APP_BAR_ALIGN } from "../actions/actionNames";

const appBarAlign = (state = 'left', action)=>{
    switch (action.type) {
		case APP_BAR_ALIGN:
			return action.payload;
		default:
			return state;
	}
}
export default appBarAlign;