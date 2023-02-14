/* const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_KEY); */
import { table, getMinifiedRecords, getRecordsByFilter } from '../../lib/airtable'



const createHalalStore = async (req, res) => {
    // find a record
    const { id, name, address, neighborhood, category, averageRating, rating, image_url } = req.body;
    if (req.method === 'POST') {
        try {
            if (id) {
                const records = await getRecordsByFilter(id);
                if (records.length !== 0) {
                    res.json(records);
                }
                else {
                    // create a record if not found 
                    if (name) {
                        const createdRecords = await table.create([{
                            fields: {
                                id,
                                name,
                                address,
                                neighborhood,
                                category,
                                averageRating: averageRating,
                                rating,
                                image_url
                            }
                        }]);
                        const records = getMinifiedRecords(createdRecords)
                        res.json(records)
                    }
                    else {
                        //request contains bad syntax or can't be fulfilled
                        res.status(400);
                        res.json({ message: 'name is missing' });
                    }

                }
            } else {
                //request contains bad syntax or can't be fulfilled
                res.status(400);
                res.json({ message: 'id is missing' });
            }
        } catch (err) {
            console.error('Error creating or finding a store', err);
            //The server failed to fulfill an apparently valid request
            res.status(500);
            res.json({ message: 'Error creating or finding a store!', err });
        };

    }
}

export default createHalalStore;