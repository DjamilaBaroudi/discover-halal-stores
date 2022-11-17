import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import halalStoresData from "../../data/halal-stores.json";
import Head from "next/head";
import styles from '../../styles/halal-store.module.css';
import cls from 'classnames';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { fetchHalalStores } from "../../lib/halal-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";

export async function getStaticProps({ params }) {
    const halalStoresData = await fetchHalalStores();
    const foundStores = halalStoresData
    .find((halalStore => {
        return halalStore.id === params.id
    }))
    return {
        props: {
            halalStore: foundStores ? foundStores : {}
        }
    }
}
export async function getStaticPaths() {
    const halalStoresData = await fetchHalalStores();

    const paths = halalStoresData.map(halalStore => {
        return {
            params: {
                id: halalStore.id
            }
        }
    });
    return {
        paths: paths,
        fallback: true,
    }
}
const HalalStore = (initialProps) => {
    const router = useRouter();

    const id = router.query.id;
    const [halalStore, setHalalStore] = useState(initialProps.halalStore);
    const { state: { halalStores } } = useContext(StoreContext);
    

    useEffect(() => {
        if (isEmpty(initialProps.halalStore)) {
            if (halalStores.length > 0) {
                const foundStoreById = halalStores
                    .find((halalStore => {
                        return halalStore.id === id
                    }))
                setHalalStore(foundStoreById);
            }
        }
    }, [id])

    if (router.isFallback) {
        return <div> Loading ... </div>
    }

    const { name, address, image_url } = halalStore;
    const handleVoteButton = () => {
        console.log("up vote");
    }
    return (
        <div>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">
                            <a> ← Back to home </a>
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <p className={styles.name}>{name}</p>
                    </div>
                    <Image
                        src={image_url}
                        width={600}
                        height={360}
                        alt={name}
                        className={styles.storeImage}></Image>
                </div>
                <div className={cls("glass", styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <LocationOnIcon/>
                        <p className={styles.text}>{address}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                        <ReviewsIcon />
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