const express = require('express');
const db = require('./db/connection');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');
// Add near the top of the file
const apiRoutes = require('./routes/apiRoutes');


// Express Middleware 
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

// Add after Express middleware
app.use('/api', apiRoutes);

// Tests express connection
    // app.get('/', (req, res) => {
    //     res.json({
    //       message: 'Hello World'
    //     });
    //   });



// Selects all parties
    app.get('/api/parties', (req, res) => {
        const sql = `SELECT * FROM parties`;
        db.query(sql, (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({
            message: 'success',
            data: rows
          });
        });
      });

// Selects a single party
    app.get('/api/party/:id', (req, res) => {
        const sql = `SELECT * FROM parties WHERE id = ?`;
        const params = [req.params.id];
        db.query(sql, params, (err, row) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: 'success',
            data: row
          });
        });
      });

// Deletes a party 
    app.delete('/api/party/:id', (req, res) => {
        const sql = `DELETE FROM parties WHERE id = ?`;
        const params = [req.params.id];
        db.query(sql, params, (err, result) => {
          if (err) {
            res.status(400).json({ error: res.message });
            // checks if anything was deleted
          } else if (!result.affectedRows) {
            res.json({
              message: 'Party not found'
            });
          } else {
            res.json({
              message: 'deleted',
              changes: result.affectedRows,
              id: req.params.id
            });
          }
        });
      });



app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});