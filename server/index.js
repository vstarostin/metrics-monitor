const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(require("./routes/index"));

["SIGINT", "SIGTERM"].forEach( (signal) => process.on(signal, () => {
    process.exit()
}));

app.listen(port, console.log(`Server is listening on ${port}...`));

