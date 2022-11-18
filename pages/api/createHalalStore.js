const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_KEY);

const table = base('halal-stores');

console.log({ table });

const createHalalStore = async (req, res) => {
    // find a record
    if (req.method === 'POST') {
        try {
            const findHalalStoreRecords = await table.select({
                filterByFormula: `id="0"`
            }).firstPage
            if (findHalalStoreRecords.length !== 0) {
                const records = findHalalStoreRecords.map(record => {
                    return ({ ...record.fields });
                })
                res.json({ records });
            }
            else {
                // create a record if not found 
                res.json({ message: 'create a record' });
            }
        } catch (err) {
            console.error('Error finding store', err);
            res.status(500);
            res.json({ message: 'Error finding store!', err });
        };

    }
}

export default createHalalStore;