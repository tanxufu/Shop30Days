import React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import LoginLayout from './layouts/LoginLayout';
import NotFoundPage from './pages/NotFoundPage';
import Checkout from './pages/Checkout';
import ChangePass from './pages/ChangePass';
import ProductList from './pages/ProductList';
import Product from './pages/Product';
import UserLayout from './layouts/UserLayout';

import Order from './pages/Order';
import History from './pages/History';
import { ScrollToTop } from './components';
import Admin from './pages/Admin';
import AdminLayout from './layouts/AdminLayout';
import useUserInfo from './hooks/useUseInfo';
import ProductsManage from './pages/ProductsManage';

function ProtectedRoute() {
    const isLogin = localStorage.getItem('userInfo');
    return isLogin ? <Outlet /> : <Navigate to='/login' />;
}

function AdminProtectedRoute() {
    const isAdmin = localStorage.getItem('admin');
    return isAdmin ? <Outlet /> : <Navigate to='/' />;
}

function RejectedRoute() {
    const isLogin = !localStorage.getItem('userInfo');
    return isLogin ? <Outlet /> : <Navigate to='/' />;
}

export default function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: '/',
            element: (
                <MainLayout>
                    <Home />
                </MainLayout>
            )
        },
        {
            path: '/productlist',
            element: (
                <MainLayout>
                    <ProductList />
                </MainLayout>
            )
        },
        {
            path: '/product',
            element: (
                <MainLayout>
                    <Product />
                </MainLayout>
            )
        },

        // rejected
        {
            path: '',
            element: <RejectedRoute />,
            children: [
                {
                    path: '/login',
                    element: (
                        <LoginLayout>
                            <Login />
                        </LoginLayout>
                    )
                },
                {
                    path: '/register',
                    element: (
                        <LoginLayout>
                            <Register />
                        </LoginLayout>
                    )
                },
                {
                    path: '/changepass',
                    element: (
                        <LoginLayout>
                            <ChangePass />
                        </LoginLayout>
                    )
                }
            ]
        },
        // protected
        {
            path: '',
            element: <ProtectedRoute />,
            children: [
                {
                    path: '/profile',
                    element: (
                        <UserLayout>
                            <Profile />
                        </UserLayout>
                    )
                },
                {
                    path: '/history',
                    element: (
                        <UserLayout>
                            <History />
                        </UserLayout>
                    )
                },

                {
                    path: '/order',
                    element: (
                        <UserLayout>
                            <Order />
                        </UserLayout>
                    )
                },
                {
                    path: '/cart',
                    element: (
                        <MainLayout>
                            <Cart />
                        </MainLayout>
                    )
                },
                {
                    path: '/checkout',
                    element: (
                        <MainLayout>
                            <Checkout />
                        </MainLayout>
                    )
                }
            ]
        },
        //admin
        {
            path: '',
            element: <AdminProtectedRoute />,
            children: [
                {
                    path: '/admin',
                    element: (
                        <AdminLayout>
                            <Admin />
                        </AdminLayout>
                    )
                },
                {
                    path: '/productsmanage',
                    element: (
                        <AdminLayout>
                            <ProductsManage />
                        </AdminLayout>
                    )
                }
            ]
        },
        {
            path: '*',
            element: (
                <MainLayout>
                    <NotFoundPage />
                </MainLayout>
            )
        }
    ]);

    return routeElements;
}
