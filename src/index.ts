import express from "express"
import cors from "cors";
import bodyParser from "body-parser";
import UserRoutes from './routes/UserRoutes';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/user', UserRoutes)

app.listen(3001, () => console.log(`Online na porta ${3001}!`));

export default app;