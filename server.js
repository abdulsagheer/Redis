const express = require("express");
const axios = require("axios");
const cors = require("cors");
const redis = require("redis");

const client = redis.createClient();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const DEFAULT_EXPIRATION = 3600;

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  redis.get("photos", async (err, photos) => {
    if (err) console.log(err);
    if (photos != null) {
      return res.json(JSON.parse(photos));
    } else {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        { params: { albumId } }
      );
      client.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data));
    }
    await client.connect();
    res.json(data);
  });
});

app.get("/photos/:id", async (req, res) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
  );
});

app.listen(3000);
