import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../../shared/PrivateRoute'
import IpPage from './pages/ipaddress'

const IpRoutes = () => {
     return (
          <Routes>
               <Route
                    path="/"
                    element={
                         <PrivateRoute requiredRole={['ADMIN', 'IP']}>
                              <IpPage />
                         </PrivateRoute>
                    }
               />
          </Routes>
     )
}

export default IpRoutes
