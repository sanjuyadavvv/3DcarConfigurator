import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ConfigProvider } from './components/context/ConfigContext.jsx'
import ConfiguratorPage from './components/ConfiguratorPage.jsx'
import "./App.css";

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/configure/exterior" replace />} />
          <Route path="/configure" element={<Navigate to="/configure/exterior" replace />} />
          <Route path="/configure/:section" element={<ConfiguratorPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
