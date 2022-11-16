// Initialize unsplash
import { createApi } from 'unsplash-js';

// on your node server
const unsplashApi = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
    //...other fetch options
});


const getUrlForHalalStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&radius=10000&limit=${limit}`
}

const getListOfHalalStoresPhotos = async () => {
    const images = await unsplashApi.search.getPhotos({
        query: 'halal restaurant',
        perPage: 40,
    });

    const results = images.response.results;
    const photosUrls = results.map((result => { return result.urls["small"] }));
    return photosUrls;
}

export const fetchHalalStores = async (latLong = "52.520007,13.404954", limit=6) => {
    const halalStoresPhotos = await getListOfHalalStoresPhotos();

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_AUTHORIZATION,
        }
    };

    const response = await fetch(getUrlForHalalStores(latLong, "halal", limit), options)

    const data = await response.json();
    return data.results.map((venue, idx) => {
        return {
            id: venue.fsq_id,
            name: venue.name,
            address: venue.location.formatted_address,
            image_url: halalStoresPhotos[idx]
        }
    });
}