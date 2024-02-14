
import React, { useState } from 'react'

interface WithPrivlegeProps {
    priv?: boolean;
}

interface IPrivilegeConfig<P extends object> {
    privileges: string[],
    errorComponent?: React.ComponentType<P>
}


const withPrivilege = <P extends object>(Component: React.ComponentType<P>, config: IPrivilegeConfig<P>) => {
    const WithPrivilege: React.FC<P & WithPrivlegeProps> = ({ ...props }) => {
        const [user, setUser] = useState({ allowedPriv: ["tab1", "tab2"] });
        const isAllowed = () => {
            return config.privileges.every(x => {
                const isExist = user.allowedPriv.includes(x);
                return isExist;

            });
        }


        return isAllowed() ? <Component {...props as P} /> : config.errorComponent ? <config.errorComponent {...props as P} /> : null
    }

    return WithPrivilege;

}

export default withPrivilege;


