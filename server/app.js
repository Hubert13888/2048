const bodyParser = require("body-parser"),
    express = require("express"),
    next = require('next'),
    cookieParser = require("cookie-parser")

const port = process.env.PORT || 3000,
    server = next({dev: process.env.NODE_ENV !== 'production'}),
    handle = server.getRequestHandler()

server
.prepare()
.then(() => {
    const app = express()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cookieParser())

    app.get("*", (req, res) => {
        return handle(req, res)
    })
    app.listen(port, err => {
        if(err) throw err
    })
})
.catch(ext => {
    console.error(ext.stack)
    process.exit(1)
})