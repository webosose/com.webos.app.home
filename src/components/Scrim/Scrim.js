import css from './Scrim.module.less';
const Scrim = ({closeMenu})=>{
    return (<div className={css.background_cnt} onClick={closeMenu} />)
}
export default Scrim;