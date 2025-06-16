export function getDueDateInfo(dueDateStr: string) {
  const dueDate = new Date(dueDateStr)
  const today = new Date()

  dueDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const msPerDay = 1000 * 60 * 60 * 24
  const diffInMs = dueDate.valueOf() - today.valueOf()
  const diffInDays = Math.round(diffInMs / msPerDay)

  let message
  if (diffInDays > 0) {
    message = `due in ${diffInDays} day${diffInDays === 1 ? '' : 's'}`
  } else if (diffInDays < 0) {
    message = `due ${Math.abs(diffInDays)} day${
      Math.abs(diffInDays) === 1 ? '' : 's'
    } ago`
  } else {
    message = 'due today'
  }

  return { message, days: diffInDays }
}

export function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
