import { table, getMinifiedRecords, getRecordsByFilter } from '../../lib/airtable'

const getHalalStoreById = async (req, res) => {
    
    const { id } = req.query;
    try {
        if (id) {
            const records = await getRecordsByFilter(id);
            if(records.length !== 0){
                res.json(records);
            }
            else {
                res.json({ messge: `id ${id} could not be found` });
            }
        }
        else {
            res.status(400);
            res.json({ message: 'id is missing' });
        }
    } catch (err) {
        console.error('Unable to retreive the requested data, an error has been occured', err);
        res.status(500);
    }
}

export default getHalalStoreById;