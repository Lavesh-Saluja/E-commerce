const mongoose = require("mongoose");
const url = process.env.url;
mongoose.connect(url, {
    useNewUrlParser: true,
   useUnifiedTopology: true
}).then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.log(err);
});