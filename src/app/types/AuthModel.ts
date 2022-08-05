export type LoginResponse = {
  success: boolean
  accessToken: string
  user: CurrentUser
}

export type CurrentUser = {
  userDisplayName: string
  storeDisplayName: string
  userType?: string
}
