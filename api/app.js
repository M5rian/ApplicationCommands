import fetch from 'node-fetch';
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.text());
app.use(cors())

app.get('/retrieve', async (req, res) => {
    const token = req.header('token');
    const id = req.header('id');
    const scope = req.query.guild_id || 'global';

    let url;
    if (scope === 'global') url = 'https://discord.com/api/v8/applications/' + id + '/commands?with_localizations=true'
    else url = `https://discord.com/api/v8/applications/${id}/guilds/${scope}/commands?with_localizations=false`;

    const promise = await fetch(url, {
        method: 'GET',
        headers: {Authorization: 'Bot ' + token}
    })
    const response = await promise.json()

    res.status(200)
    console.log('>> GET /retrieve')
    res.send(response);
});

app.post('/update', async (req, res) => {
    console.log('update called')
    const token = req.header('token');
    const id = req.header('id')
    const guild = req.query.guild_id
    const slashCommands = JSON.parse(decodeURI(req.body))

    let url
    if (guild == null) url = 'https://discord.com/api/v8/applications/' + id + '/commands'
    else url = 'https://discord.com/api/v8/applications/' + id + '/guilds/' + guild + '/commands'
    const promise = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bot ' + token
        },
        body: JSON.stringify(slashCommands)
    })
    const response = await promise.json()

    res.status(200)
    console.log(`>> POST /update [${promise.status}] ${promise.status !== 200 ? ' - ' + response.message : ''}`)
    console.log('errors = ' + JSON.stringify(response.errors, null, 4))
    res.send(response)
})

app.post('/create', async (req, res) => {
    const token = req.header('token');
    const id = req.header('id')
    const slashCommand = JSON.parse(req.header('json'))

    const url = 'https://discord.com/api/v8/applications/' + id + '/commands'
    const promise = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bot ' + token
        },
        body: JSON.stringify(slashCommand, null)
    })
    const response = await promise.json()

    res.status(200)
    console.log('>> POST /create')
    res.send(response);
})

app.get('/bot', async (req, res) => {
    const token = req.header('token');

    const url = 'https://discord.com/api/v8/users/@me'
    const promise = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: 'Bot ' + token
        },
    })
    const response = await promise.json()

    res.status(200)
    console.log('>> GET /bot')
    res.send(response);
})

app.listen(8182, () => {
    console.log('App\'s running on port 8182');
});