import { table, getRecordsByFilter, getMinifiedRecords } from '../../lib/airtable'

const favouriteHalalStoreById = async (req, res) => {
    if (req.method = 'PUT') {
        const { id } = req.body;

        try {
            if (id) {
                const records = await getRecordsByFilter(id);
                if (records.length !== 0) {
                    const record = records[0];
                    const calculateAverageRating = parseInt((record.rating  + record.averageRating + 1)) / 2;

                    // update a record
                    const updatedRecord = await table.update([
                        {
                            id: record.recordId,
                            fields: {
                                rating: record.rating,
                                averageRating: calculateAverageRating,
                            }
                        }
                    ]);

                    if (updatedRecord) {
                        const minifiedRecord = getMinifiedRecords(updatedRecord);
                        res.json(minifiedRecord);
                    }

                }
                else {
                    res.json({ message: 'Halal store could not be found', id })
                }
            }
        }
        catch (err) {
            console.error('Something went wrong', err);
            res.json({ message: 'Something went wrong', err })
        }
    }
}

export default favouriteHalalStoreById;