import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Authentication from './pages/AuthenticationPage';
import MeetComponent from './pages/MeetPage';
import HomeComponent from './pages/HomePage';
import HistoryComponent from './pages/HistoryPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
              <Route path = "/" element={<LandingPage />}></Route>
              <Route path = "/auth" element={<Authentication />}></Route>
              <Route path = "/join" element = {<HomeComponent />}></Route>
              <Route path = "/history" element = {<HistoryComponent />}></Route>
              <Route path = "/:id" element={<MeetComponent />}></Route>
          </Routes>
        </AuthProvider>
    </Router>
  )
}