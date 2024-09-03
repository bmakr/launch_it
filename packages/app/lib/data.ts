// const isExpo = !!process.env.EXPO_ROUTER_APP_ROOT
const isProduction = process.env.NODE_ENV === 'production'

const API_URL = isProduction ? 'https://actualed.com' : 'http://localhost:3000'

export { API_URL }
export const API_ENDPOINT_SIGNUP = 'api/auth/signup'
export const API_ENDPOINT_VERIFY = 'api/auth/verify'
export const API_ENDPOINT_LOGIN = 'api/auth/login'
export const API_ENDPOINT_LOGOUT = 'api/auth/logout'
export const API_ENDPOINT_RESEND = 'api/auth/resend'

// images
const CLOUDFLARE_URL = 'https://imagedelivery.net'
const CLOUDFLARE_ID = '6mgEv1oiFiEZf73JB3qb6A'
const CLOUDFLARE_BUCKET = 'public'
const HOME_LOGO_ID = '95f6cd37-954c-43c5-0039-d1be08af7200'
const HEADER_LOGO_ID = 'e8435582-1bdb-4733-bf79-4383478c4000'
export const HOME_LOGO = `${CLOUDFLARE_URL}/${CLOUDFLARE_ID}/${HOME_LOGO_ID}/${CLOUDFLARE_BUCKET}`
export const HEADER_LOGO = `${CLOUDFLARE_URL}/${CLOUDFLARE_ID}/${HEADER_LOGO_ID}/${CLOUDFLARE_BUCKET}`