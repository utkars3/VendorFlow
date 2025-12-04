import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import rfpRoutes from './routes/rfp.routes';
import vendorRoutes from './routes/vendor.routes';

app.use(cors());
app.use(express.json());

app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);

app.get('/', (req, res) => {
    res.send('RFP Management System API');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
