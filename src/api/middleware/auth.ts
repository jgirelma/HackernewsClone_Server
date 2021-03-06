const isLoggedIn = (req : any) => {
  return !!(req.session!.userId)
}

export const loggedInMiddleware = (req : any, _res : any, next : any) => {
  if(!isLoggedIn(req)) {
    return next(new Error("Not Authorized : Not Logged In"))
  }

  next()
}

export const isNotLoggedInMiddleware = (req : any, _res : any, next : any)  => {
  if(isLoggedIn(req)) {
    return next(new Error("Not Authorized : Already Logged In"))
  }

  next()
}