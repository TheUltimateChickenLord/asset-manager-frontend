import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../components/PrivateRoute'
import Layout from '../components/Layout'
import NotFound from '../pages/Errors/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<></>} />
      <Route
        path="/reset-password"
        element={
          <PrivateRoute>
            <></>
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={
            <PrivateRoute>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assets"
          element={
            <PrivateRoute roles={[['ReadAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assets/new"
          element={
            <PrivateRoute roles={[['CreateEditAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/edit"
          element={
            <PrivateRoute roles={[['ReadAsset', 'CreateEditAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/check-out"
          element={
            <PrivateRoute roles={[['CheckInOutAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/request"
          element={
            <PrivateRoute roles={[['ReadAsset', 'RequestAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id"
          element={
            <PrivateRoute roles={[['ReadAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/labels"
          element={
            <PrivateRoute roles={[['ReadAsset', 'CreateEditAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/link"
          element={
            <PrivateRoute roles={[['ReadAsset', 'LinkAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute roles={[['ReadUser']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="users/new"
          element={
            <PrivateRoute roles={[['CreateEditUser']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="users/:id"
          element={
            <PrivateRoute roles={[['ReadUser']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="users/:id/labels"
          element={
            <PrivateRoute roles={[['ReadUser', 'CreateEditUser']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="users/:id/roles"
          element={
            <PrivateRoute roles={[['ReadUser', 'CreateEditUser']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="requests"
          element={
            <PrivateRoute roles={[['CheckInOutAsset'], ['RequestAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="requests/:id"
          element={
            <PrivateRoute roles={[['CheckInOutAsset'], ['RequestAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="requests/:id/check-out"
          element={
            <PrivateRoute roles={[['CheckInOutAsset'], ['RequestAsset']]}>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assignments"
          element={
            <PrivateRoute>
              <></>
            </PrivateRoute>
          }
        />
        <Route
          path="assignments/:id"
          element={
            <PrivateRoute>
              <></>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
