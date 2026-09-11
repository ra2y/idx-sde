import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ListingsPage from "./pages/ListingsPage";
import FavoritesPage from "./pages/FavoritesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import ErrorBoundary from "./components/ErrorBoundary";

import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<ListingsPage />}
          />

          <Route
            path="/favorites"
            element={<FavoritesPage />}
          />

          <Route
            path="/property/:id"
            element={<PropertyDetailPage />}
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;