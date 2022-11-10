import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import halalStoresData from "../../data/halal-stores.json";
import Head from "next/head";
import styles from '../../styles/halal-store.module.css';
import cls from 'classnames';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReviewsIcon from '@mui/icons-material/Reviews';

export function getStaticProps({ params }) {
    return {
        props: {
            halalStore: halalStoresData.local_results.places
                .find((halalStore => {
                    return halalStore.place_id === params.id
                }))
        }
    }
}
export function getStaticPaths() {
    const paths = halalStoresData.local_results.places.map(halalStore => {
        return {
            params: {
                id: halalStore.place_id
            }
        }
    });
    return {
        paths: paths,
        fallback: true,
    }
}
const HalalStore = (props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <div> Loading ... </div>
    }
    const { title, address, image_url, evaluation } = props.halalStore;
    const handleVoteButton = () => {
        console.log("up vote");
    }
    return (
        <div>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">
                            <a>  Back to home </a>
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <p className={styles.name}>{title}</p>
                    </div>
                    <Image
                        src={image_url}
                        width={600}
                        height={360}
                        alt={title}
                        className={styles.storeImage}></Image>
                </div>
                <div className={cls("glass", styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <LocationOnIcon/>
                        <p className={styles.text}>{address}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                        <ReviewsIcon/>
                        <p className={styles.text}>{evaluation}</p>
                    </div>
                    <button
                        className={styles.upvoteButton}
                        onClick={handleVoteButton}> Up Vote!
                    </button>
                </div>
            </div>
        </div>
    )

}

export default HalalStore;