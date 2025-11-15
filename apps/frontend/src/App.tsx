import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

function App(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<div>KOMPASS - Coming Soon</div>} />
      </Routes>
    </div>
  );
}

export default App;
