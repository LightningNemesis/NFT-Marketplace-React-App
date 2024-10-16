import "./app.css";
import Layout from "./components/Layout/Layout";
import { AppProvider } from "./contexts/Context";

function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export default App;
