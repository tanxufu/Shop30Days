import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './NotFoundPage.module.scss';
import { Button } from '~/components';

const cx = classNames.bind(styles);

function NotFoundPage() {
    return (
        <div className={cx('page404')}>
            <div className={cx('container')}>
                <div className={cx('page404__title')}>KHÔNG TÌM THẤY TRANG NÀY</div>
                <Button primary to='/'>
                    Quay lại Trang chủ
                </Button>
            </div>
        </div>
    );
}

export default NotFoundPage;
