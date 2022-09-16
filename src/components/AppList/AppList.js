import css from './AppList.module.less';
import AppIcon from '../AppIcon/AppIcon';
import { getClientWidth } from '../../util/util';
import { useSelector } from 'react-redux';

const AppList = ({apps}) => {
    const launchPadEdit = useSelector(state=>state.editStatus.launchPad);
    const appNames = useSelector(state => state.appNames);
    return (<div className={css.item} style={{ width: getClientWidth() + 'px' }}>
        {apps.map((app, index) => (
            <AppIcon src={'file:' + app.icon}  key={index} source='launchpad' edit={launchPadEdit && appNames.indexOf(app.id) <= -1} title={app.title} id={app.id} defaultapp={app.default} removable={app.removable}/>
        ))}
    </div>)
}
export default AppList;