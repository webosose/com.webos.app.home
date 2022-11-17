import service from '../service/service';
const closeAppAction = (appid,callback) => () => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.close({
        id: appid,
        params: { displayAffinity },
        onSuccess: () => {
            callback();
        }
    });
}
export default closeAppAction;