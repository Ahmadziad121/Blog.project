var express= require('express')
var app=express();


const {MongoClient}=require('mongodb')

var connection="mongodb+srv://ahmadziad758:zAdhu6N1MB2EZWKe@cluster0.vwd87ks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client= new MongoClient(connection , { useNewUrlParser: true, useUnifiedTopology: true });


var bodyParse= require('body-parser')
async function connectMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}
connectMongo();

var urlEncoded= bodyParse.urlencoded({extended:false})


app.get('/',function (req, res) {
    res.send('start my server');})

    app.post('/users', urlEncoded,async (req, res) => {
        try {
            const mydb = client.db('users');
            const collection = mydb.collection('users'); 
            const { email, username, password } = req.body;
            await collection.insertOne({ email, username, password });
            res.json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user:', error);
            res.json({ error: 'Internal server error' });
        }
    });
    app.post('/blogs', urlEncoded, async (req, res) => {
        try {
            const blogsCollection = client.db().collection('blogs'); 
            const { userId, title, content } = req.body;
            await blogsCollection.insertOne({ userId, title, content });
            res.json({ message: 'Blog created successfully' });
        } catch (error) {
            console.error('Error creating blog:', error);
            res.json({ error: 'Internal server error' });
        }
    });
    
app.get('/blogs/:userId', async (req, res) => {
    try {
        const blogsCollection = client.db("users").collection('blogs');
        const cachedData = await getFromCache(req.originalUrl);
        if (cachedData) {
            res.json(cachedData);
        } else {
            const data = await blogsCollection.find().toArray();
            await cacheData(req.originalUrl, data);
            res.json(data);
        }
    } catch (error) {
        console.error('Error caching blog data:', error);
        res.json({ error: 'Internal server error' });
    }
});
app.get('/search', urlEncoded,async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Missing search query' });
        }
        const blogsCollection = client.db("users").collection('blogs');
        const searchResults = await blogsCollection.find({}).toArray();
        res.json(searchResults);
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



async function getFromCache(key) {
   
}


async function cacheData(key, data) {
   
}


var server= app.listen(8000,function()
{
     var host = server.address().address
     var port=server.address().port

     console.log("start my one")
})