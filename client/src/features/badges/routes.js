import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../../shared/PrivateRoute'
import BadgesPage from './pages/badges'

const BadgesRoutes = () => {
     return (
          <Routes>
               <Route
                    path="/"
                    element={
                         <PrivateRoute requiredRole={['ADMIN', 'BADGES']}>
                              <BadgesPage />
                         </PrivateRoute>
                    }
               />
          </Routes>
     )
}

export default BadgesRoutes
