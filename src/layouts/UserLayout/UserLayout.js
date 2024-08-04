import classNames from 'classnames/bind';
import styles from './UserLayout.module.scss';
import { Footer, Header } from '~/components';
import image from '~/assets/images';
import { NavLink } from 'react-router-dom';
import icon from '~/assets/icons';
import useUserInfo from '~/hooks/useUseInfo';

const cx = classNames.bind(styles);

function UserLayout({ children }) {
    const userInfo = useUserInfo();

    // console.log(userInfo);

    return (
        <main>
            <Header />
            <div className={cx('profile')}>
                <div className={cx('container')}>
                    <div className={cx('row')}>
                        {/* sidebar */}
                        <div className={cx('col-3')}>
                            <aside className={cx('profile__sidebar')}>
                                <div className={cx('profile-user')}>
                                    <img src={image.avatar} alt='user' className={cx('profile-user__avatar')} />
                                    <h1 className={cx('profile-user__name')}>{userInfo?.name}</h1>
                                </div>
                                <div className={cx('profile-menu')}>
                                    <h3 className={cx('profile-menu__title')}>Quản Lý Tài Khoản</h3>
                                    <ul className={cx('profile-menu__list')}>
                                        <li>
                                            <NavLink
                                                to='/profile'
                                                end
                                                className={({ isActive }) =>
                                                    cx('profile-menu__link', {
                                                        'profile-menu__link--active': isActive
                                                    })
                                                }
                                            >
                                                <span className={cx('profile-menu__icon')}>
                                                    <img src={icon.user} alt='prrofile' />
                                                </span>
                                                Hồ Sơ
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to='' className={cx('profile-menu__link')}>
                                                <span className={cx('profile-menu__icon')}>
                                                    <img src={icon.location} alt='address' className='' />
                                                </span>
                                                Thêm địa chỉ
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                                <div className={cx('profile-menu')}>
                                    <h3 className={cx('profile-menu__title')}>Sản Phẩm</h3>
                                    <ul className={cx('profile-menu__list')}>
                                        <li>
                                            <NavLink to='/favourite' className={cx('profile-menu__link')}>
                                                <span className={cx('profile-menu__icon')}>
                                                    <img src={icon.favourite} alt='favourite' className='' />
                                                </span>
                                                Danh sách Yêu thích
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to='/history'
                                                className={({ isActive }) =>
                                                    cx('profile-menu__link', {
                                                        'profile-menu__link--active': isActive
                                                    })
                                                }
                                            >
                                                <span className={cx('profile-menu__icon')}>
                                                    <img src={icon.history} alt='history' className='' />
                                                </span>
                                                Lịch sử Đơn hàng
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to='' className={cx('profile-menu__link')}>
                                                <span className={cx('profile-menu__icon')}>
                                                    <img src={icon.truck} alt='deli-status' className='' />
                                                </span>
                                                Tình trạng đơn hàng
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </aside>
                        </div>

                        <div className={cx('col-9')}>{children}</div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default UserLayout;
