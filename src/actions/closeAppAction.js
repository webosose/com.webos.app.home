import service from '../service/service';
const closeAppAction = (appid) => () => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.close({
        id: appid,
        params: { displayAffinity },
        onSuccess: () => {

        }
    });
}
export default closeAppAction;