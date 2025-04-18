const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.post('/api/average', (req, res) => {

  const startTime = process.hrtime();
  
  try {
    const { numbers } = req.body;
    
   
    if (!numbers || !Array.isArray(numbers)) {
      return res.status(400).json({ 
        error: 'Invalid input. Please provide an array of numbers.'
      });
    }
    
    if (numbers.length === 0) {
      return res.status(400).json({ 
        error: 'Empty array provided. Cannot calculate average.'
      });
    }
    
   
    for (const num of numbers) {
      if (typeof num !== 'number' || isNaN(num)) {
        return res.status(400).json({ 
          error: 'All elements must be valid numbers.'
        });
      }
    }
    
 
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const average = sum / numbers.length;
    
    
    const endTime = process.hrtime(startTime);
    const executionTime = endTime[0] * 1000 + endTime[1] / 1000000; // in milliseconds
    
    return res.status(200).json({
      average: average,
      count: numbers.length,
      executionTime: `${executionTime.toFixed(2)} ms`
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});