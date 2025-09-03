import React from 'react';
import RewardsProgram from '../src/components/rewards/RewardsProgram/RewardsProgram';
import './App.css';
/**
 * Root component of the Rewards App.
 *
 * This component serves as the entry point of the application.
 * It renders the `RewardsProgram` component inside a wrapper div
 * with a global CSS class.
 *
 * @returns {JSX.Element} The rendered application.
 */
function App() {
  return (
    <div className="app">
      {/* Render the main rewards program feature */}
      <RewardsProgram />
    </div>
  );
}

export default App;