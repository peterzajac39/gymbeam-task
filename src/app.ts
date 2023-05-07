import express, { Application, Request, Response } from 'express'
import helmet from 'helmet';
import controller from './controller'
import { checkSchema } from 'express-validator';
import { schema } from './validation/schema';

const app: Application = express()
app.use(express.json())

const port: number = 3000

app.get('/getPath', 
    checkSchema(schema),
    controller.getShortestPath);


app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})

export default app;