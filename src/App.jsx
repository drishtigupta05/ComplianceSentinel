import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConsentProvider } from './context/ConsentContext'
import Header from './components/layout/Header'
import LandingPage from './screens/LandingPage'
import ConsentCapture from './screens/ConsentCapture'
import ConsentLedger from './screens/ConsentLedger'
import AdminDashboard from './screens/AdminDashboard'
import IncidentLinkage from './screens/IncidentLinkage'

export default function App() {
  return (
    <ConsentProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFBFD' }}>
          {/* Shared top fixed header */}
          <Header />

          {/* Main content container */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/"         element={<LandingPage />} />
              <Route path="/consent"  element={<ConsentCapture />} />
              <Route path="/ledger"   element={<ConsentLedger />} />
              <Route path="/admin"    element={<AdminDashboard />} />
              <Route path="/incident" element={<IncidentLinkage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ConsentProvider>
  )
}
