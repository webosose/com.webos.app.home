import { HIDE_ALERT, SHOW_ALERT } from "../actions/actionNames";

const appAlert = (state = {}, action)=>{
    switch (action.type) {
		case SHOW_ALERT:
			return {show:true,...action.payload};
		case HIDE_ALERT:
			return {show:false};
		default:
			return state;
	}
}
export default appAlert;