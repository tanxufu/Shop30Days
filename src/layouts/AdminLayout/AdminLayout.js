import classNames from 'classnames/bind';
import styles from './AdminLayout.module.scss';
import { Logo } from '~/components';
import icon from '~/assets/icons';
import { Link, NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    return (
        <div className={cx('admin')}>
            <div className={cx('row')}>
                {/* sidebar */}
                <div className={cx('col-2')}>
                    <aside className={cx('admin-sidebar')}>
                        <Logo />

                        <ul className={cx('admin-sidebar__list')}>
                            <li className={cx('admin-sidebar__item')}>
                                <NavLink
                                    end
                                    to='/admin'
                                    className={({ isActive }) =>
                                        cx('admin-sidebar__link', {
                                            'admin-sidebar__link--active': isActive
                                        })
                                    }
                                >
                                    <img src={icon.orders} alt='orders' className={cx('admin-sidebar__icon')} />
                                    Quản lý Đơn hàng
                                </NavLink>
                            </li>
                            <li className={cx('admin-sidebar__item')}>
                                <NavLink
                                    to='/productsmanage'
                                    className={({ isActive }) =>
                                        cx('admin-sidebar__link', {
                                            'admin-sidebar__link--active': isActive
                                        })
                                    }
                                >
                                    <img src={icon.products} alt='orders' className={cx('admin-sidebar__icon')} />
                                    Quản lý Sản phẩm
                                </NavLink>
                            </li>
                        </ul>
                    </aside>
                </div>

                {/* content */}
                <div className={cx('col-10')}>
                    <div className={cx('admin-header')}>
                        <div className={cx('admin-header__act')}>
                            <button className={cx('admin-header__notifi')}>
                                <img
                                    src={icon.notification}
                                    alt='notification'
                                    className={cx('admin-header__notifi--icon')}
                                />
                            </button>
                            <div className={cx('admin-header__user')}>
                                <div className={cx('admin-header__avatar')}>AD</div>
                                <p className={cx('admin-header__name')}>Admin</p>
                                <img src={icon.arrowDown} alt='arrowDown' className={cx('admin-header__user--icon')} />
                            </div>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
