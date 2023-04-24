 const connectToMongo = require('./db');
 const express = require('express')
 connectToMongo();

 
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
app.use(cors());
// available routes

app.use(express.json())
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))

app.get('/', (req, res) => {
 console.log(req.body);
 res.send("hello");
})

app.listen(port, () => {
  console.log(`iNotebook backend  listening on port ${port}`)
})