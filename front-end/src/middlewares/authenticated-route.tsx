import { IChildren } from '../interfaces/children-interface'
import { useAuth } from '../providers/auth-context-provider'
import { Redirect } from '../tools/redirect'

function AuthenticatedRoute({children}: {children: JSX.Element}) {
    const auth = useAuth()

    if (!auth.isLoggedIn) {
        return <Redirect to='/auth/login' />
    }

    return children
}

export default AuthenticatedRoute