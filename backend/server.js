import express from "express";
import data from "./data.js";

const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send("backend is ready");
})

app.get('/api/product', (req, res) => {
    res.send(data.products);
})

app.listen(port,()=>{
    console.log(`listening on ${port}`);
})