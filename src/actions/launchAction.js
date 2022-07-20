import service from '../service/service';
import { SHOW_APP } from './actionNames';
const launchAction = (appid) => dispatch => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.launch({
        id: appid,
        params: { displayAffinity },
        onSuccess: () => {
            dispatch({
                type: SHOW_APP,
                payload: false
            });
        }
    });
}
export default launchAction;