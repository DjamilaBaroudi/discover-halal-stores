
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesom'
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { styled } from '@mui/material/styles';
import styles from './rating.module.css';

const StyledRating = styled(Rating)({
    '& .MuiRating-icon': {
        fontSize: '2rem',
    },
    '& .MuiRating-iconFilled': {
        color: '#3F0071',
        fontSize: '2rem',
    },
    '& .MuiRating-iconHover': {
        color: '#00005C',
        fontSize: '2rem'
    },
});

const StarRating = (props) => {
    return (
        <div className={styles.container}>
            <StyledRating
                name="customized-color"
                defaultValue={0}
                getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}`}
                precision={0.5}
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
        </div>
    )
}

export default StarRating