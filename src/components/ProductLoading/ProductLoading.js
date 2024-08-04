import styles from './ProductLoading.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ProductLoading() {
    return (
        <div className={cx('product-card__loading')}>
            <div className={cx('product-card__loading--img-wrap')}>
                <div className={cx('product-card__loading--img')}></div>
            </div>
            <div className={cx('product-card__loading--info')}>
                <div className={cx('product-card__loading--name')}></div>
                <div className={cx('product-card__loading--btn')}></div>
            </div>
            <span className={cx('product-card__loading--price')}></span>
        </div>
    );
}

export default ProductLoading;
