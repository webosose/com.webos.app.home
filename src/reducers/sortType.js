import { SORT_TYPE_UPDATE } from "../actions/actionNames";

const sortType = (state = 'a_to_z', action)=>{
    switch (action.type) {
		case SORT_TYPE_UPDATE:
			return action.payload;
		default:
			return state;
	}
}
export default sortType;