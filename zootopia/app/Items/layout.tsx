import React from "react"

const Layout = ({ children}: { children: React.ReactNode}) => {
    return (
        <div>
            <p>Items NavBar from layout</p>
            {children}
        </div>
    )
}

export default Layout