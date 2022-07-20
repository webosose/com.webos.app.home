import service from '../service/service';
const deleteApp = (appid) => () => {
    service.removeApp({
        id: appid,
        onSuccess: () => {

        }
    });
}
export default deleteApp;