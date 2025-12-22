import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../../shared/PrivateRoute'
import CardPage from './pages/CardPage'

const UsbRoutes = () => {
     return (
          <Routes>
               <Route
                    path="/"
                    element={
                         <PrivateRoute requiredRole={['ADMIN', 'CARD']}>
                              <CardPage />
                         </PrivateRoute>
                    }
               />
          </Routes>
     )
}

export default UsbRoutes
