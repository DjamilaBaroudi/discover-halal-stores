import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from '../../styles/halal-store.module.css';
import cls from 'classnames';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { fetchHalalStores } from "../../lib/halal-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";
import StarRating from "../../components/rating";
import StoreIcon from '@mui/icons-material/Store';
import useSWR from 'swr';

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

    const handleCreateHalalStore = async (halalStore) => {
        const { id, name, address, neighborhood, category, averageRating, rating, image_url }
            = halalStore;
        try {
            const response = await fetch('/api/createHalalStore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    name,
                    address: address || "",
                    neighborhood: neighborhood || "",
                    category: category || "",
                    averageRating: averageRating || 0.0,
                    rating: rating || 0.0,
                    image_url
                })
            });
            const dbHalalStores = response.json();
        } catch (error) {
            console.error("An error has occured when creating a store", err)
        }
    }
    useEffect(() => {
        if (isEmpty(initialProps.halalStore)) {
            if (halalStores.length > 0) {
                const foundStoreByIdFromContext = halalStores
                    .find((halalStore => {
                        return halalStore.id === id
                    }))
                if (foundStoreByIdFromContext) {
                    setHalalStore(foundStoreByIdFromContext);
                    handleCreateHalalStore(foundStoreByIdFromContext);
                }
            }
        } else {
            handleCreateHalalStore(initialProps.halalStore);
        }
    }, [id, initialProps, initialProps.halalStore])

    const [ratingText, setRatingText] = useState(1);
    const [value, setValue] = useState(0);

    const getLabelText = () => { (value) => `${value} Star${value !== 1 ? 's' : ''}` };

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`/api/getHalalStoreById?id=${id}`, fetcher);

    useEffect(() => {
        if (data && data.length > 0) {
            console.log('data from swr', data);
            setHalalStore(data[0]);
            setValue(data[0].rating)
            setRatingText(data[0].averageRating);
        }
    }, [data])


    if (error) {
        return <div>Something went wrong retrieving data!</div>
    }
    if (router.isFallback) {
        return <div> Loading ... </div>
    }
    const { name, address, image_url, neighborhood, category, averageRating, rating } = halalStore;

    const handleStoreRating = async (event, newValue) => {
        try {
            const response = await fetch('/api/favouriteHalalStoreById', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    rating,
                })
            });
            const dbHalalStores = response.json();
            setValue(newValue);
        } catch (error) {
            console.error("An error has occured when creating a store", err)
        }
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
                        <NearMeIcon />
                        <p className={styles.text}>{address}</p>
                    </div>
                    {neighborhood &&
                        <div className={styles.iconWrapper}>
                            <LocationOnIcon />
                            <p className={styles.text}>{neighborhood}</p>
                        </div>
                    }
                    {category &&
                        <div className={styles.iconWrapper}>
                            <StoreIcon />
                            <p className={styles.smallText}>{category}</p>
                        </div>
                    }
                    <div className={styles.iconWrapper}>
                        <ReviewsIcon />
                        <p className={styles.ratingText}> {averageRating ? averageRating + rating : value} </p>
                    </div>

                    <StarRating value={value} onChange={handleStoreRating}
                        getLabelText={getLabelText} />
                </div>
            </div>
        </div>
    )

}

export default HalalStore;