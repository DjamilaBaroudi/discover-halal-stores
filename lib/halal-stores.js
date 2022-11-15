// Initialize unsplash
import { createApi } from 'unsplash-js';

// on your node server
const unsplashApi = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    //...other fetch options
});


const getUrlForHalalStores = (LatLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${LatLong}&radius=5000&limit=${limit}`
}

const getListOfHalalStoresPhotos = async () => {
    const images = await unsplashApi.search.getPhotos({
        query: 'halal places',
        page: 1,
        perPage: 10,
        color: 'green',
        orientation: 'portrait',
    });

    const results = images.response.results;
    const photosUrls = results.map((result => { return result.urls["small"] }));
    return photosUrls;
}

export const fetchHalalStores = async () => {

    const halalStoresPhotos = await getListOfHalalStoresPhotos();

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.FOURSQUARE_AUTHORIZATION,
        }
    };

    const response = await fetch(getUrlForHalalStores("52.520007,13.404954", "halal", "6"), options)

    const data = await response.json();
    return data.results.map((venue, idx) => {
        return {
            ...venue, 
            image_url: halalStoresPhotos[idx]
        }
    });
}