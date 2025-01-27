import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
const path= request.nextUrl.pathname

const ispublic = path==='/' || path==='/doctors'  

const token= request.cookies.get('token')?.value||''

if(ispublic && token){
    return NextResponse.redirect(new URL('/dashboard',request.url))
}



 if(!ispublic && !token){
    return NextResponse.redirect(new URL('/',request.url))
}
}
 
export const config = {
  matcher: ['/','/doctors/:path*','/login','/daashboard','/verifyMe/:path*'],
}

// export const config = {
//   matcher: ["/", "/doctors", "/dashboard","/((?!api|_next|favicon.ico).*)"],
// };

