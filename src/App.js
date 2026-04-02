import React from 'react';
// This line "grabs" your form from the components folder
import IndividualForm from './components/IndividualForm';

function App() {
  return (
    <div className="App">
      {/* This line displays the form */}
      <IndividualForm />
    </div>
  );
}

export default App;
