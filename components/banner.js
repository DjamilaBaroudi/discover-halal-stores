import styles from './banner.module.css'

const Banner = (props) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <span className={styles.title1}> Halal </span>
                <span className={styles.title2}> St</span>
                <span className={styles.title3}>ores</span>
            </h1>
            <p className={styles.subtitle}> Discover halal stores near you </p>
            <div className={styles.buttonWrapper}>
                <button className={styles.button} onClick={props.handleOnClick}>
                    <span> {props.buttonText} </span>
                </button>
            </div>
        </div>
    )
}

export default Banner;