
import css from './AddedApp.module.less';
import AppIcon from '../AppIcon/AppIcon';
import { useSelector } from 'react-redux';
const AddedApps = ({ apps }) => {
    const appBarEdit = useSelector(state=>state.editStatus.appBar);
    return (<div className={css.addedApps}>
        {
            apps.map((value, index) => {
                return value ? <AppIcon {...value} edit={appBarEdit} key={index} newlyAdded/> : '';
            }
            )}
    </div>)
}

export default AddedApps;