const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_KEY);

const table = base('halal-stores');

console.log({ table });

const createHalalStore = async (req, res) => {
    // find a record
    const { id, name, address, neighborhood, category, review, rating, image_url } = req.body;
    if (req.method === 'POST') {
        try {
            if (id) {
                const findHalalStoreRecords = await table.select({
                    filterByFormula: `id=${id}`
                }).firstPage
                if (findHalalStoreRecords.length !== 0) {
                    const records = findHalalStoreRecords.map(record => {
                        return ({ ...record.fields });
                    })
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
                                review,
                                rating,
                                image_url
                            }
                        }]);
                        const records = createdRecords.map(record => {
                            return ({
                                ...record.fields
                            })
                        })
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