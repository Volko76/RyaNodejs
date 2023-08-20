const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors());

const pool = mysql.createPool({
  host: 'containers-us-west-202.railway.app',
  user: 'root',
  port: '7912',
  password: 'doHuGoKwWQm3BwYjADwF',
  database: 'railway',
});
const connection = mysql.createConnection({
  host: 'containers-us-west-202.railway.app',
  port: '7912',
  user: 'root',
  password: 'doHuGoKwWQm3BwYjADwF',
  database: 'railway'
});
connection.connect();
// Route handler for the "add" endpoint
app.post('/add', (req, res) => {
  const { nom, prenom, addresse, telephone, hauteur, largeur, poids, prenomDest, nomDest, addresseDest, telephoneDest } = req.body;

  // Insert the data into the MySQL database
  const query = `INSERT INTO colis (nom, prenom, addresse, telephone, hauteur, largeur, poids, prenomDest, nomDest, addresseDest, telephoneDest) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(query, [nom, prenom, addresse, telephone, hauteur, largeur, poids, prenomDest, nomDest, addresseDest, telephoneDest], (error, results) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to add the order' });
    } else {
      const orderId = results.insertId; // Get the inserted order ID
      res.json({ orderId }); // Return the order ID in the response
    }
  });
});

// Set up the API endpoint for updating data
app.put('/updating/:order_id', (req, res) => {
  const id = req.params.id;
  const { order_id, prenom, nom, est_arrive } = req.body;

  // Update the data in the MySQL database
  const query = `UPDATE colis SET prenom = ?, nom = ?, est_arrive = ? WHERE order_id = ?`;
  pool.query(query, [prenom, nom, est_arrive, order_id], (error, results) => {
    if (error) {
      console.error('Error updating data: ', error);
      res.status(500).json({ error: 'Error updating data' });
      return;
    }

    console.log('Data updated successfully');
    console.log("coucou")
    console.log([prenom, nom, order_id, est_arrive])
    res.status(200).json({ message: 'Data updated successfully' });
  });
});

app.get('/all/:id', (req, res) => {
  const id = req.params.id;
  pool.query(`SELECT order_id, prenom, nom, est_arrive FROM colis WHERE order_id = ?`, [id], (error, results) => {
    if (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log(results);
      console.log(id);
      res.json(results);
    }
  });
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  pool.query('DELETE FROM colis WHERE order_id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ error: 'Error deleting data' });
      return;
    }

    console.log('Data deleted successfully');
    res.status(200).json({ message: 'Data deleted successfully' });
  });
});


const port = 3001; // Replace with your desired port number

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});