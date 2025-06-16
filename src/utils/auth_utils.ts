export const password_regex = new RegExp(
  /^(?=.{8,}$)(?=.*?\d)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^A-Za-z\s0-9])/g,
)

export const verifyPasswordComplexity = (password: string): boolean =>
  password_regex.test(password)
