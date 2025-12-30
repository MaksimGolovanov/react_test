import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../../shared/PrivateRoute'
import Json from './pages/JsonViewer'

const JsonRoutes = () => {
     return (
          <Routes>
               <Route
                    path="/json"
                    element={
                         <PrivateRoute requiredRole={['ADMIN', 'JSON']}>
                              <Json />
                         </PrivateRoute>
                    }
               />
          </Routes>
     )
}

export default JsonRoutes
