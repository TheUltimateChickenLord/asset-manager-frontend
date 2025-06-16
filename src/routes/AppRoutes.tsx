import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import AssetList from '../pages/Assets/AssetList'
import AssetDetail from '../pages/Assets/AssetDetail'
import PrivateRoute from '../components/PrivateRoute'
import Layout from '../components/Layout'
import EditAssetForm from '../pages/Assets/EditAsset'
import NewAssetForm from '../pages/Assets/NewAsset'
import RequestAssetPage from '../pages/Assets/RequestAsset'
import CheckOutAssetPage from '../pages/Assets/CheckoutAsset'
import NotFound from '../pages/Errors/NotFound'
import AssignmentList from '../pages/Assignments/AssignmentList'
import AssignmentDetail from '../pages/Assignments/AssignmentDetail'
import AssetLabelsPage from '../pages/Assets/AssetLabelsPage'
import LinkAssetsPage from '../pages/Assets/LinkAssets'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
              <AssetList />
            </PrivateRoute>
          }
        />
        <Route
          path="assets/new"
          element={
            <PrivateRoute roles={[['CreateEditAsset']]}>
              <NewAssetForm />
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/edit"
          element={
            <PrivateRoute roles={[['ReadAsset', 'CreateEditAsset']]}>
              <EditAssetForm />
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/check-out"
          element={
            <PrivateRoute roles={[['CheckInOutAsset']]}>
              <CheckOutAssetPage />
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/request"
          element={
            <PrivateRoute roles={[['ReadAsset', 'RequestAsset']]}>
              <RequestAssetPage />
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id"
          element={
            <PrivateRoute roles={[['ReadAsset']]}>
              <AssetDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/labels"
          element={
            <PrivateRoute roles={[['ReadAsset', 'CreateEditAsset']]}>
              <AssetLabelsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="assets/:id/link"
          element={
            <PrivateRoute roles={[['ReadAsset', 'LinkAsset']]}>
              <LinkAssetsPage />
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
              <AssignmentList />
            </PrivateRoute>
          }
        />
        <Route
          path="assignments/:id"
          element={
            <PrivateRoute>
              <AssignmentDetail />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
