import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [numbers, setNumbers] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('averageHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);
    setAnimation(true);

    try {
      const numbersArray = numbers
        .split(',')
        .map(num => num.trim())
        .filter(num => num !== '')
        .map(num => {
          const parsed = parseFloat(num);
          if (isNaN(parsed)) {
            throw new Error(`"${num}" is not a valid number`);
          }
          return parsed;
        });

      if (numbersArray.length === 0) {
        setError('Please enter at least one number');
        return;
      }

      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/average', {
        numbers: numbersArray
      });

      setResult(response.data);
      const newHistoryItem = {
        numbers: numbersArray,
        result: response.data,
        timestamp: new Date().toLocaleString()
      };
      
      const updatedHistory = [newHistoryItem, ...history.slice(0, 4)];
      setHistory(updatedHistory);
      localStorage.setItem('averageHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setAnimation(false), 1000);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('averageHistory');
  };

  return (
    <div className="App">
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDelay: `${Math.random() * 5}s`
          }}></div>
        ))}
      </div>
      
      <header className="App-header">
        <h1>Average Calculator</h1>
        <p className="subtitle">Calculate the average of any set of numbers</p>
      </header>
      
      <main>
        <div className={`calculator-container ${animation ? 'pulse' : ''}`}>
          <form onSubmit={handleSubmit}>
            <div className="form-group floating-label">
              <textarea
                id="numbers"
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                placeholder=" "
                rows={4}
                className={numbers ? 'has-value' : ''}
              />
              <label htmlFor="numbers">Enter numbers (comma-separated)</label>
              <div className="input-hint">e.g. 1, 2, 3, 4, 5</div>
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="calculate-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Calculating...
                  </>
                ) : (
                  'Calculate Average'
                )}
              </button>
              
              <button 
                type="button" 
                className="history-btn"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-container slide-down">
              <div className="error-icon">!</div>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="result-container slide-down">
              <div className="result-header">
                <h2>Result</h2>
                <div className="result-badge">
                  Average: <span>{result.average}</span>
                </div>
              </div>
              
              <div className="result-details">
                <div className="result-item">
                  <div className="result-label">
                    <svg viewBox="0 0 24 24">
                      <path d="M17,17H7V3H17M17,1H7A2,2 0 0,0 5,3V17A2,2 0 0,0 7,19H17A2,2 0 0,0 19,17V3A2,2 0 0,0 17,1M7,21H17V23H7V21Z" />
                    </svg>
                    Count
                  </div>
                  <div className="result-value">{result.count}</div>
                </div>
                
                <div className="result-item">
                  <div className="result-label">
                    <svg viewBox="0 0 24 24">
                      <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                    </svg>
                    Execution Time
                  </div>
                  <div className="result-value">{result.executionTime} ms</div>
                </div>
              </div>
            </div>
          )}
          
          {showHistory && (
            <div className="history-container slide-down">
              <div className="history-header">
                <h3>Recent Calculations</h3>
                {history.length > 0 && (
                  <button className="clear-history" onClick={clearHistory}>
                    Clear
                  </button>
                )}
              </div>
              
              {history.length === 0 ? (
                <div className="empty-history">
                  <svg viewBox="0 0 24 24">
                    <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" />
                  </svg>
                  <p>No calculations yet</p>
                </div>
              ) : (
                <ul className="history-list">
                  {history.map((item, index) => (
                    <li key={index} className="history-item">
                      <div className="history-numbers">
                        {item.numbers.join(', ')}
                      </div>
                      <div className="history-result">
                        <span>Avg: {item.result.average}</span>
                        <span className="history-time">{item.timestamp}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="App-footer">
        <p>© {new Date().getFullYear()} Average Calculator</p>
      </footer>
    </div>
  );
}

export default App;