import express from "express"
import cors from "cors";
import bodyParser from "body-parser";
import UserRoutes from './routes/UserRoutes';
import StoreRoutes from './routes/StoreRoutes';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/user', UserRoutes)
app.use('/store', StoreRoutes)

app.listen(3000, () => console.log(`Online na rota  ${3000}!`));

export default app;