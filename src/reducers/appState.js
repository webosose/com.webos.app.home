import { SHOW_APP } from "../actions/actionNames";

const appState = (state = false, action)=>{
    switch (action.type) {
		case SHOW_APP:
			return action.payload
		default:
			return state;
	}
}
export default appState;