const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_KEY);

const table = base('halal-stores');

const getMinifiedRecord = (record) => {
    return {
        ...record.fields
    }
}
const getMinifiedRecords = (records) => {
    return records.map(record => getMinifiedRecord(record))
}

const getRecordsByFilter = async (id) => {
    const findHalalStoreRecords = await table.select({
        filterByFormula: `id="${id}"`
    }).firstPage();


    return getMinifiedRecords(findHalalStoreRecords);
}
export { table, getMinifiedRecords, getRecordsByFilter }

