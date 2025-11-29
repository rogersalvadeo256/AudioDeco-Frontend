import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Upload from './components/Upload';
import Player from './components/Player';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/player/:id" element={<Player />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </PlayerProvider>
    </ThemeProvider>
  );
};

export default App;
