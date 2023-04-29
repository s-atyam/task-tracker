const express = require('express');
const conn_db = require('./db/config');
const cors = require('cors')

const app = express()
app.use(cors());
app.use(express.json());

const port = 5000;
app.get('/',(request,response)=>{
    response.send('From server to client');
})

// available routes
app.use('/user',require('./db/db_routes'));
// app.use('/api/notes',require('./routes/notes'));

app.listen(port,()=>{
    console.log(`task-tracker is listening on port ${port}`);
})