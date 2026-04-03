import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../../shared/PrivateRoute'
import TransportPage from './pages/transport'

const TransportRoutes = () => {
     return (
          <Routes>
               <Route
                    path="/"
                    element={
                         <PrivateRoute requiredRole={['ADMIN', 'TRANSPORT']}>
                              <TransportPage />
                         </PrivateRoute>
                    }
               />
          </Routes>
     )
}

export default TransportRoutes
