var express= require('express')
const cors = require('cors');
var app=express();
app.use(cors())

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

app.post('/profile', urlEncoded,async (req, res) => {
    try {
        const mydb = client.db('users');
        const collection = mydb.collection('users'); 
        const { email, username, password } = req.body;
        await collection.insertOne({ email, username, password });
        res.json({ message: 'User created successfully' });}
        catch (error) {
        console.error('Error creating user:', error);
        res.json({ error: 'Internal server error' });
        }
    });

app.get('/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const collection = client.db("users").collection('users');
        const user = await collection.findOne({ email });
        if (!user) {
            return res.json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
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
        const cachedData = await getFromCache(req.originalUrl);
        if (cachedData) {
            res.json(cachedData);
        } else {
            const blogsCollection = client.db("users").collection('blogs');
            const data = await blogsCollection.find({}).toArray();
            await cacheData(req.originalUrl, data);
            res.json(data);
        }
    } catch (error) {
        console.error('Error caching blog data:', error);
        res.json({ error: 'Internal server error' });
    }
});

app.get('/search', async (req, res) => {
    try {
        const { query } = req.query; 
        const blogsCollection = client.db("users").collection('blogs');
        const searchResults = await blogsCollection.find({'content':query}).toArray();
        const searchHistoryCollection = client.db("users").collection('searchhistory');
        await searchHistoryCollection.insertOne({ query, timestamp: new Date() });
        
        res.json(searchResults);
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const NodeCache = require("node-cache");
const cache = new NodeCache();




async function getFromCache(key) {
   return cache.get(key)
}


async function cacheData(key, data) {
   cache.set(key,data)
}


var server= app.listen(8000,function()
{
     var host = server.address().address
     var port=server.address().port
     console.log("start my one")
})