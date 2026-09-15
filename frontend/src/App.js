import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ListingsPage from "./pages/ListingsPage";
import FavoritesPage from "./pages/FavoritesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import ErrorBoundary from "./components/ErrorBoundary";
import OpenHouseCalendarPage from "./pages/OpenHouseCalendarPage";

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
          <Route
            path="/openhouses"
            element={<OpenHouseCalendarPage />}
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;