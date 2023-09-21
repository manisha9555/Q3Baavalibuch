const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/your-database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to the MongoDB database'))
    .catch((err) => console.error('Failed to connect to the MongoDB database:', err));

const requestCountSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0,
    },
});
const RequestCount = mongoose.model('RequestCount', requestCountSchema);
const stringSchema = new mongoose.Schema({
    str: {
        type: String,
        default: 0,
    },
});
const Stored = mongoose.model('Mymodel', stringSchema);
let requestCount = 0;

app.use(async (req, res, next) => {
    try {
        const requestCount = await RequestCount.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
        console.log(`Request count: ${requestCount.count}`);
        next();
    } catch (error) {
        console.error('Failed to update request count:', error);
    }
});
app.get('/', async(req, res) => {
    const requestCount = await RequestCount.findOne()
    res.send('hi th count is ' + requestCount.count);
});

app.get('/count', async (req, res) => {
    try {
        // Get the count of documents in the collection
        const obj = await RequestCount.findOne()
        const count = obj.count;
        console.log(count)
        res.send({ count });
    } catch (error) {
        console.error('Failed to get count:', error);
        res.status(500).send({ error: 'Failed to get count' });
    }
});
app.post('/string', express.json(), async (req, res) => {
    try {
        // Get the string from the request body
        const a  = req.body.str;

        // Create a new document in the collection
        const document = new Stored({
            str: a
        });

        // Save the document to the database
        await document.save();

        // Send the document back to the client
        res.send({ document });
    } catch (error) {
        console.error('Failed to save string:', error);
        res.status(500).send({ error: 'Failed to save string' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
