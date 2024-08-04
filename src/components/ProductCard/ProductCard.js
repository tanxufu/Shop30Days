import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';
import classNames from 'classnames/bind';
import icon from '~/assets/icons';

const cx = classNames.bind(styles);

function ProductCard({ id, imageUrl, name, price }) {
    return (
        <article className={cx('product-card')}>
            <div className={cx('product-card__img-wrap')}>
                <Link to={`/product?${id}`}>
                    <img src={imageUrl} alt={name} className={cx('product-card__img')} />
                </Link>
            </div>
            <div className={cx('product-card__name-wrap')}>
                <Link to={`/product?${id}`}>
                    <h3 className={cx('product-card__name')}>{name}</h3>
                </Link>

                <button className={cx('like-btn')}>
                    <img src={icon.heart} className={cx('like-btn__icon')} alt='like button' />
                </button>
            </div>
            <span className={cx('product-card__price')}>{price}</span>
        </article>
    );
}

export default ProductCard;
