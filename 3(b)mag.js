const AnotherModel = mongoose.model('AnotherModel', anotherSchema); 

app.post('/string', express.json(), async (req, res) => {
    try {
        
        const str = req.body.str;
        const document = new AnotherModel({
            str: str 
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
