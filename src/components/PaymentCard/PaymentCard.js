import styles from './PaymentCard.module.scss';
import classNames from 'classnames/bind';
import icon from '~/assets/icons';

const cx = classNames.bind(styles);

function PaymentCard({ bankName, cardNumber, cardholderName, expiryDate, onClick }) {
    return (
        <article className={cx('payment-card')} style={{ backgroundColor: '#354151' }} onClick={onClick}>
            <img src={icon.leaf_bg} alt='' className={cx('payment-card__img')} />
            <div className={cx('payment-card__top')}>
                <img src={icon.leaf} alt='' className={cx('payment-card__icon')} />
                <span className={cx('payment-card__type')}>{bankName}</span>
            </div>
            <div className={cx('payment-card__number')}>{cardNumber}</div>
            <div className={cx('payment-card__bottom')}>
                <div>
                    <p className={cx('payment-card__label')}>PaymentCard Holder</p>
                    <p className={cx('payment-card__value')}>{cardholderName}</p>
                </div>
                <div className={cx('payment-card__expire')}>
                    <p className={cx('payment-card__label')}>Expired</p>
                    <p className={cx('payment-card__value')}>{expiryDate}</p>
                </div>
                <div className={cx('payment-card__circle')}></div>
            </div>
        </article>
    );
}

export default PaymentCard;
