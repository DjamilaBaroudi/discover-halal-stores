
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { styled } from '@mui/material/styles';
import styles from './rating.module.css';
import  Box  from '@mui/material/Box';

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
const labels = {
    0:'No rating yet',
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};
const StarRating = (props) => {
    return (
        <div className={styles.container}>
            <StyledRating
                name="customized-color"
                defaultValue={0}
                getLabelText={props.getLabelText}
                value={props.value}
                precision={0.5}
                icon={<StarIcon fontSize="inherit" />}
                onChange={props.onChange}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
            {props.value !== null && (
                <Box sx={{ ml: 2 }}>{labels[props.value]}</Box>
            )}
        </div>

    )
}

export default StarRating;