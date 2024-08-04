import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import icon from '~/assets/icons';
import Logo from '../Logo';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('footer__inner')}>
                <div className={cx('container')}>
                    <Logo />
                    <div className={cx('footer__info')}>
                        <div className={cx('row row-cols-3 gx-4')}>
                            <div className={cx('col')}>
                                <ul className={cx('footer__list')}>
                                    <li>
                                        <Link to='/about' className={cx('footer__link')}>
                                            <span>Về chúng tôi</span>
                                            <img
                                                src={icon.arrowRight}
                                                alt='arrowRight'
                                                className={cx('footer__link--icon')}
                                            />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/policy' className={cx('footer__link')}>
                                            <span>Chính sách</span>
                                            <img
                                                src={icon.arrowRight}
                                                alt='arrowRight'
                                                className={cx('footer__link--icon')}
                                            />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className={cx('col')}>
                                <ul className={cx('footer__list')}>
                                    <li>
                                        <Link to='/productlist' className={cx('footer__link')}>
                                            <span>Sản phẩm</span>
                                            <img
                                                src={icon.arrowRight}
                                                alt='arrowRight'
                                                className={cx('footer__link--icon')}
                                            />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/faq' className={cx('footer__link')}>
                                            <span>FAQ</span>
                                            <img
                                                src={icon.arrowRight}
                                                alt='arrowRight'
                                                className={cx('footer__link--icon')}
                                            />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className={cx('col')}>
                                <ul className={cx('footer__list')}>
                                    <li>
                                        <Link to='/profile' className={cx('footer__link')}>
                                            <span>Hồ sơ</span>
                                            <img
                                                src={icon.arrowRight}
                                                alt='arrowRight'
                                                className={cx('footer__link--icon')}
                                            />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('footer__license')}>© 30 DAYS SHOP, Inc.</div>
        </footer>
    );
}

export default Footer;
