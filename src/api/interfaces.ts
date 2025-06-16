export interface Asset {
  id: number
  asset_tag: string
  name: string
  description: string
  status: 'Available' | 'In Use' | 'Maintenance' | 'Reserved'
  purchase_date: string
  purchase_cost: number
  created_at: string
  last_maintenance: string
  maintenance_rate: number
  is_deleted: boolean
  linked_assets: LinkedAsset[]
  linked_to: LinkedAsset[]
  labels: Label[]
}

export interface CreateAsset {
  asset_tag: string
  name: string
  description: string
  purchase_date: string
  purchase_cost: number
  maintenance_rate: number
  labels: Label[]
}

export interface CheckOutAsset {
  asset_id: number
  user_id: number
  due_in_days: number
}

export interface UpdateAsset {
  asset_tag?: string
  name?: string
  description?: string
  purchase_date?: string
  purchase_cost?: number
  maintenance_rate?: number
}

export interface Label {
  id: number
  name: string
}

export interface User {
  id: number
  name: string
  email: string
  is_disabled: boolean
  is_deleted: boolean
  created_at: string
  reset_password: boolean
  labels: Label[]
  roles: Role[]
}

export interface SmallUser {
  id: number
  name: string
  email: string
}

export interface CreateUser {
  name: string
  email: string
  password: string
  labels: string[]
}

export interface Role {
  role: string
  scope: string
}

export interface LinkedAsset {
  id: number
  asset_id: number
  linked_id: number
  relation: 'License' | 'Consumable' | 'Peripheral'
}

export interface Request {
  id: number
  user_id: number
  asset_id: number
  status: 'Approved' | 'Rejected' | 'Pending' | 'Fulfilled'
  justification: string
  requested_at: string
  approved_by: number | null
  asset: {
    id: number
    asset_tag: string
    name: string
    description: string
    labels: Label[]
  }
  user: SmallUser
  approver: SmallUser | null
  assignment: {
    id: number
  } | null
}

export interface Assignment {
  id: number
  asset_id: number
  user_id: number
  assigned_by_id: number
  assigned_at: string
  due_date: string
  returned_at: string | null
  request_id: number | null
  asset: Asset
  user: SmallUser
  assigned_by: SmallUser
}
