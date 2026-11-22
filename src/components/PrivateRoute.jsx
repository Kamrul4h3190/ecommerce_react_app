import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user?.roles?.includes("ROLE_SELLER");

    if (publicPage) {
        return user
            ? <Navigate to="/" replace />
            : <Outlet />;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (adminOnly) {
        if (!isAdmin && !isSeller) {
            return <Navigate to="/" replace />;
        }

        if (isSeller && !isAdmin) {
            const sellerAllowedPaths = [
                "/admin/orders",
                "/admin/products"
            ];

            const allowed = sellerAllowedPaths.some(path =>
                location.pathname === path ||
                location.pathname.startsWith(path + "/")
            );

            if (!allowed) {
                return <Navigate to="/" replace />;
            }
        }
    }

    return <Outlet />;
};

export default PrivateRoute;
