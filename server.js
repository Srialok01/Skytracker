const express = require('express');
const app = express();
const port = 5000;

app.use(express.static('.'));
app.use(express.json());

const flights = [
    { id: 1, from: 'Delhi', to: 'Mumbai', price: 5000, airline: 'IndiGo' },
    { id: 2, from: 'Mumbai', to: 'Bangalore', price: 4500, airline: 'Air India' },
    { id: 3, from: 'Bangalore', to: 'Delhi', price: 6000, airline: 'SpiceJet' }
];

app.get('/api/flights', (req, res) => {
    res.json(flights);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});