let sessionUser: any = null

export const setSessionUser = (user: any) => {
  sessionUser = user
}

export const getSessionUser = () => {
  return sessionUser
}

export const clearSessionUser = () => {
  sessionUser = null
}
