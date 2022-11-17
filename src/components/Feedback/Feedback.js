import BodyText from "@enact/sandstone/BodyText"
import Button from "@enact/sandstone/Button"
import Image from "@enact/sandstone/Image";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import star from '../../../assets/star.png';
import star_none from '../../../assets/star_none.png';
import { HIDE_FEEDBACK } from "../../actions/actionNames";
import css from './Feedback.module.less';

const Feedback = ({ appName, appId }) => {
    const [rate, setRate] = useState(0);
    const [feedbackText, setFeedbackTest] = useState('');
    const dispatch = useDispatch();
    const clickRatingIcon = useCallback((event) => {
        const value = event.target.getAttribute('rate');
        setRate(parseInt(value));
    }, [])
    const renderStars = useCallback(() => {
        return [1, 2, 3, 4, 5].map((value,index) => {
            let icon = star_none;
            if (rate >= value) {
                icon = star
            }
            return <Image src={icon} className={css.icon} key={index} onClick={clickRatingIcon} rate={value} />;
        })
    }, [rate, clickRatingIcon])
    const submitFeedback = useCallback(() => {
        dispatch({
            type: HIDE_FEEDBACK
        });
        const object = {
            "main":"com.webos.app.home",
            "sub": "appbar",
            "event": "appreview",
            "extra": {
                "appname":appId,
                "rating":rate,
                "feedback":feedbackText
            }
        }
        window.PalmSystem.PmLogString(6, 'DATA_COLLECTION', JSON.stringify(object), '');
    }, [appId, rate, feedbackText,dispatch])
    const handleChange = useCallback((event) => {
        setFeedbackTest(event.target.value);
    }, [])
    return (<div>
        <BodyText className={css.heading}>{appName}</BodyText>
        <div className={css.firstbox}>
            <BodyText>What do you think of this app?</BodyText>
            <div className={css.starbox}>{renderStars()}</div>
        </div>

        <div className={css.secondbox}>
            <BodyText>What would you like to share with us?(option)</BodyText>
            <textarea value={feedbackText} onChange={handleChange}/>
        </div>
        <Button onClick={submitFeedback} disabled={!rate}>Submit</Button>
    </div>)
}

export default Feedback;