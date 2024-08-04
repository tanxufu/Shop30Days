import styles from './LoginLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function LoginLayout({ children }) {
    return (
        <div className={cx('loginlayout')}>
            <div className={cx('loginlayout__inner')}>{children}</div>
        </div>
    );
}

export default LoginLayout;
