import service from '../service';
import { RUNNING_APPS } from './actionNames';
const exclude = ["com.webos.app.volume", "com.webos.app.home", "com.webos.app.notification", "bareapp"]
let timer;
const getRunningApps = () => (dispatch) => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.running({
        subscribe: true,
        onSuccess: (res) => {
            if (res.returnValue && res.running) {
                const runningApps = [];
                res.running.forEach(v => {
                    if (displayAffinity === v.displayId && exclude.indexOf(v.id) <= -1) {
                        runningApps.push(v.id);
                    }
                });
                dispatch({
                    type: RUNNING_APPS,
                    payload: runningApps
                });
            }

        },
        onFailure: (error) => {
            console.log("getRunningApps: Error ",error);
            clearTimeout(timer);
            timer = setTimeout(()=>{
                dispatch(getRunningApps());
            },3000);
        }
    });
}

export default getRunningApps;