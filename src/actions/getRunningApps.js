import service from '../service';
import { RUNNING_APPS } from './actionNames';
const getRunningApps = () => (dispatch) => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.running({
        subscribe: true,
        onSuccess: (res) => {
            if (res.returnValue && res.running) {
                const runningApps = [];
                res.running.forEach(v => {
                    if (displayAffinity === v.displayId) {
                        runningApps.push(v.id);
                    }
                });
                dispatch({
                    type: RUNNING_APPS,
                    payload: runningApps
                });
            }

        },
        onFailure: () => {

        }
    });
}

export default getRunningApps;