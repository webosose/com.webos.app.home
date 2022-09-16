import { SET_LAUNCHPAD_EDIT, CLEAR_LAUNCHPAD_EDIT, SET_APPBAR_EDIT, CLEAR_APPBAR_EDIT, CLEAR_EDIT } from "../actions/actionNames";

const editStatus = (state = { launchPad: false, appBar: false }, action) => {
    switch (action.type) {
        case SET_LAUNCHPAD_EDIT:
            return { ...state, launchPad: true };
        case CLEAR_LAUNCHPAD_EDIT:
            return { ...state, launchPad: false };
        case SET_APPBAR_EDIT:
            return { ...state, appBar: true };
        case CLEAR_APPBAR_EDIT:
            return { ...state, appBar: false };
        case CLEAR_EDIT:
            return {};
        default:
            return state;
    }
}
export default editStatus;