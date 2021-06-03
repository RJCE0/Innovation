import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Home } from './pages';
import OpportunityCard from './components/opportunity-card/OpportunityCard';
import React from 'react';
import Footer from './components/footer';

function App() {
  return (
    <Router>
      <Home />
      <OpportunityCard
        title='Internship 1'
        desc='Example internship 1.'
        date='June 3rd 2021'
        salary='£21 p/w'
        location='London'
      />
      <Footer /> 
    </Router>
  );
}

export default App;
