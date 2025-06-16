import { useState } from 'react'

export default function useConfirm(): [boolean, () => void, () => void] {
  const [openConfirm, setOpenConfirm] = useState(false)

  const open = () => {
    setOpenConfirm(true)
  }

  const close = () => {
    setOpenConfirm(false)
  }

  return [openConfirm, open, close]
}
