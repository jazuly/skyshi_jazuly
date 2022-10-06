import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv'
dotenv.config()

//initialise the express package
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8081

//use the serve-static package to serve the bundled app files in the dist directory
app.use(express.static(__dirname + '/dist'))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, (_, res) => {
  res.sendFile(__dirname + '/dist/index.html')
})

//heroku automatically assigns port so leave it to do it's
//work, don't set a port in the heroku dashboard. while the
//5000 or whatever number you set will be for your local
//machine.
app.listen(port)
console.log(`app is listening on port: ${port}`)

