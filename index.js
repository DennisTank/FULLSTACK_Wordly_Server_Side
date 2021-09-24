import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routers/index.js";
import mysqlConnection from "./database/index.js";

import { UploadProfileImage } from "./database/assets/ImageRoute.js";

const app = express();
const PORT = 5000;

mysqlConnection.connect((err) => {
  if (err) {
    console.log("error: " + err.message);
    return;
  }
  console.log("Database Connected");
});

app.use(bodyParser.json());
app.use(cors());
app.use("/images", express.static("database/assets/images"));

/* all operations*/
//auth
app.get("/auth", router);
//user handlers
app.post("/register", router);

app.get("/login", router);
app.get("/user", router);
app.get("/search", router);

app.patch("/update_username", router);
app.patch("/update_dob", router);
app.patch("/update_bio", router);

//quote handlers
app.get("/quotes", router);
app.post("/quote", router);
app.delete("/quote", router);

//profile image
app.post("/image", UploadProfileImage);

//likes
app.get("/likes", router);

app.post("/like", router);

app.delete("/like", router);

//friends
app.get("/followers", router);
app.get("/followings", router);
app.get("/follow", router);

app.post("/follow", router);

app.delete("/removeFollow", router);

/*----------------*/

app.listen(PORT, () => {
  console.log(`Server Started at host:localhost port:${PORT}`);
});
