export const server = {
  url: 'http://localhost:3000',
  host: 'localhost',
  port: 3000
}

export const protectedRequestOptions = (token: string | null) => ({
  headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
});