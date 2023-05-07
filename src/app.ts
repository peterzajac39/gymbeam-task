import express, { Application, Request, Response } from 'express'
import helmet from 'helmet';
import controller from './controller'


const app: Application = express()
app.use(express.json())

const port: number = 3000

app.get('/toto', controller.getShortestPath)


app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})