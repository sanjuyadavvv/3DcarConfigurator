import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from './components/context/ConfigContext.jsx'
import LandingPage from './components/LandingPage.jsx'
import ConfiguratorPage from './components/ConfiguratorPage.jsx'
import "./App.css";

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/configure/:section" element={<ConfiguratorPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;