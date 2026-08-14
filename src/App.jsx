import { ConfigProvider } from './components/context/ConfigContext.jsx'
import ConfiguratorPage from './components/ConfiguratorPage.jsx'
import "./App.css";

function App() {
  return (
    <ConfigProvider>
      <ConfiguratorPage />
    </ConfigProvider>
  );
}

export default App;
