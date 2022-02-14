import fetch from 'node-fetch';
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json());
app.use(cors())

app.get("/retrieve", async (req, res) => {
    const token = req.header("token")
    const id = req.header("id")

    const url = "https://discord.com/api/v8/applications/" + id + "/commands"
    const promise = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Bot " + token
        }
    })
    const response = await promise.json()

    res.status(200)
    console.log(">> GET /retrieve")
    console.log(JSON.stringify(response, null, 4))
    res.send(response);
});

app.get("/update", async (req, res) => {
    const token = req.header("token");
    const id = req.header("id")
    const slashCommands = JSON.parse(req.header("slashCommands"))

    const url = "https://discord.com/api/v8/applications/" + id + "/commands"
    const promise = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bot " + token
        },
        body: JSON.stringify(slashCommands, null)
    })
    const response = await promise.json()

    res.status(200)
    console.log(`>> GET /update [${promise.status}] ${promise.status !== 200 ? " - " + response.message : ""}`)
    console.log(JSON.stringify(slashCommands, null, 4))
    console.log(JSON.stringify(response.errors))
    res.send(response)
})

app.post("/create", async (req, res) => {
    const token = req.header("token");
    const id = req.header("id")
    const slashCommand = JSON.parse(req.header("json"))

    const url = "https://discord.com/api/v8/applications/" + id + "/commands"
    const promise = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bot " + token
        },
        body: JSON.stringify(slashCommand, null)
    })
    const response = await promise.json()

    res.status(200)
    console.log(">> POST /create")
    res.send(response);
})

app.get("/bot", async (req, res) => {
    const token = req.header("token");

    const url = "https://discord.com/api/v8/users/@me"
    const promise = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Bot " + token
        },
    })
    const response = await promise.json()

    res.status(200)
    console.log(">> GET /bot")
    res.send(response);
})

app.listen(8182, () => {
    console.log("App's running on port 8182");
});