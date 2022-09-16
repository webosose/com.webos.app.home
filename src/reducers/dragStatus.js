import { SET_DRAGGING, SET_DROP_HIGHLIGHT, CLEAR_DRAG } from "../actions/actionNames";

const dragStatus = (state = { highlight: '', dragging: false }, action) => {
    switch (action.type) {
        case SET_DRAGGING:
            return { ...state, dragging: true };
        case SET_DROP_HIGHLIGHT:
            return { ...state, highlight: action.payload };
        case CLEAR_DRAG:
            return {};
        default:
            return state;
    }
}
export default dragStatus;