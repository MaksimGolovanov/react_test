import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../../shared/PrivateRoute'
import UsbPage from './pages/UsbPage'

const UsbRoutes = () => {
     return (
          <Routes>
               <Route
                    path="/"
                    element={
                         <PrivateRoute requiredRole={['ADMIN', 'IP']}>
                              <UsbPage />
                         </PrivateRoute>
                    }
               />
          </Routes>
     )
}

export default UsbRoutes
