const getUrlForHalalStores = (LatLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${LatLong}&radius=5000&limit=${limit}`
}

export const fetchHalalStores = async () => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3tHCJ6KdWW6xCNFUTrWxlNcyKItBez/q95podJlzEp7w='
        }
    };

    const response = await fetch(getUrlForHalalStores("52.520007,13.404954", "halal", "6"), options)

    const data = await response.json();
    return data.results;
}