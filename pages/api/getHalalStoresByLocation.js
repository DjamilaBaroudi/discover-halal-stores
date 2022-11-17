import { fetchHalalStores } from '/lib/halal-stores'

const getHalalStoresByLocation = async (req, res) => {
    try {
        const { latLong, limit } = req.query;
        const response = await fetchHalalStores(latLong, limit);
        res.status(200);
        res.json(response);
    }
    catch (err) {
        console.error('There is an error', err);
        res.status(500);
        res.json({message: "Oh no! Something ent wrong", err})
    }
    //return res;
}

export default getHalalStoresByLocation;