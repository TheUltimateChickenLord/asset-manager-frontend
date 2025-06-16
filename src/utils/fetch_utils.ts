export function runFetch(input: RequestInfo | URL, init?: RequestInit) {
  const jwt = localStorage.getItem('jwt') || ''

  if (init == undefined) init = {}

  if (init.headers == undefined) init.headers = {}

  if (jwt != '')
    init.headers = { ...init.headers, Authorization: 'Bearer ' + jwt }

  return fetch(input, init)
}
