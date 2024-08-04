import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Logo() {
    return (
        <div>
            <Link to='/' className={cx('logo')}>
                <h1 className={cx('logo__title')}>30 Days Shop</h1>
            </Link>
        </div>
    );
}

export default Logo;
