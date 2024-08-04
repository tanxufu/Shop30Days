import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import Button from '../Button';
import Logo from '../Logo';
import icon from '~/assets/icons';
import { useEffect, useState } from 'react';
import image from '~/assets/images';
import { useQuery, useQueryClient } from 'react-query';
import useUserInfo from '~/hooks/useUseInfo';
import { getProductsPending } from '~/apis/products.api';

const cx = classNames.bind(styles);

function Header() {
    const [isLogin, setIsLogin] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    const user = useUserInfo();
    const userId = user?.userId;

    const { data: order } = useQuery({
        queryKey: ['product', userId],
        queryFn: () => getProductsPending(userId)
    });

    const orderItems = order?.data?.items;
    const status = order?.data?.deliStatus;

    // console.log(orderItems?.length);

    useEffect(() => {
        const userInfoLocal = localStorage.getItem('userInfo');

        if (userInfoLocal) {
            setUserInfo(JSON.parse(userInfoLocal));
            setIsLogin(true);
        }
    }, []);

    // console.log(userInfo);

    const handleLogout = () => {
        localStorage.clear();
        setIsLogin(false);
        navigate('/');
    };

    return (
        <div className={cx('topbar')}>
            <div className={cx('container')}>
                <div className={cx('topbar__inner')}>
                    <Logo />

                    <div className={cx('search')}>
                        <input placeholder='Tìm kiếm sản phẩm' className={cx('search__input')} />
                        <button className={cx('search__btn')}>
                            <img src={icon.search} alt='search' className={cx('search__icon')} />
                        </button>
                    </div>

                    <div className={cx('topbar__act')}>
                        <Link to='/cart' className={cx('topbar__act--link')}>
                            <img src={icon.cart} alt='cart' className={cx('topbar__act--icon')} />
                            {status === 'pending' && orderItems?.length != 0 ? (
                                <span className={cx('topbar__act--cart')}></span>
                            ) : null}
                        </Link>
                        <Link to='/favourites' className={cx('topbar__act--link')} style={{ marginTop: 4 }}>
                            <img src={icon.favourite} alt='favourites' className={cx('topbar__act--icon')} />
                        </Link>
                        {isLogin ? (
                            <div className={cx('topbar__user')}>
                                <img src={image.avatar} alt='user_avatar' className={cx('topbar__avt')} />
                                <div className={cx('topbar__dropdown', 'dropdown')}>
                                    <div className={cx('dropdown__inner')}>
                                        <div className={cx('dropdown__top')}>
                                            <img src={image.avatar} alt='user_avatar' className={cx('dropdown__avt')} />
                                            <div>
                                                <p className={cx('dropdown__username')}>{userInfo.name}</p>
                                                <p>{userInfo.email}</p>
                                            </div>
                                        </div>
                                        <ul className={cx('dropdown__list')}>
                                            <li>
                                                <Link to='/profile' className={cx('dropdown__link')}>
                                                    <img
                                                        src={icon.profile}
                                                        className={cx('dropdown__icon')}
                                                        alt='profile'
                                                    />
                                                    Hồ Sơ
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to='/favourite' className={cx('dropdown__link')}>
                                                    <img
                                                        src={icon.heart}
                                                        className={cx('dropdown__icon')}
                                                        alt='favourite'
                                                    />
                                                    Yêu Thích
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to='/cart' className={cx('dropdown__link')}>
                                                    <img src={icon.cart} className={cx('dropdown__icon')} alt='cart' />
                                                    Giỏ Hàng
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to='/history' className={cx('dropdown__link')}>
                                                    <img
                                                        src={icon.history}
                                                        className={cx('dropdown__icon')}
                                                        alt='history'
                                                    />
                                                    Lịch Sử Đơn Hàng
                                                </Link>
                                            </li>
                                            <li className={cx('dropdown__separate')}></li>
                                            <li>
                                                <p onClick={handleLogout} className={cx('dropdown__link')}>
                                                    <img
                                                        src={icon.logout}
                                                        className={cx('dropdown__icon')}
                                                        alt='logout'
                                                    />
                                                    Đăng xuất
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Button primary to='/login'>
                                Đăng nhập
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
