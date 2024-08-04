import classNames from 'classnames/bind';
import styles from './CheckoutInfo.module.scss';
import icon from '~/assets/icons';
import useUserInfo from '~/hooks/useUseInfo';
import { getOderPending } from '~/apis/products.api';
import { useQuery } from 'react-query';

const cx = classNames.bind(styles);

function CheckoutInfo({ children, deliMethod }) {
    const userInfo = useUserInfo();
    const userId = userInfo?.userId;

    const { data } = useQuery({
        queryKey: ['order', userId],
        queryFn: () => getOderPending(userId),
        refetchInterval: 1000
    });
    const order = data?.data[0];

    // console.log(data?.data[0]);

    return (
        <div className={cx('checkout-info')}>
            <p className={cx('checkout-info__product')}>
                TỔNG SẢN PHẨM &nbsp;:&nbsp;&nbsp;
                <span className={cx('checkout-info__quantity')}>{order?.quantity}</span>
                &nbsp;&nbsp;Sản phẩm
            </p>
            <p className={cx('checkout-info__item')}>
                TỔNG TIỀN &nbsp;:&nbsp;&nbsp;
                <span className={cx('checkout-info__price')}>
                    {order === undefined ? '0.000 ₫' : `${order?.totalAmount?.toLocaleString('vi-VN')}.000 ₫`}
                </span>
            </p>
            <p className={cx('checkout-info__item')}>
                PHÍ VẬN CHUYỂN &nbsp;:&nbsp;&nbsp;
                <span className={cx('checkout-info__deli')}>
                    {`${deliMethod === 'delivery' ? '20' : '0'}.000 ₫`}
                    {/* {`${order?.deliveryMethodId === 'delivery' ? '50' : '0'}.000 ₫`} */}
                </span>
            </p>
            <p className={cx('checkout-info__item', 'checkout-info__total')}>
                TỔNG ĐƠN HÀNG &nbsp;:&nbsp;&nbsp;
                <span className={cx('checkout-info__total--price')}>
                    {order === undefined
                        ? '0.000 ₫'
                        : `${deliMethod === 'delivery' ? (20 + order?.totalAmount)?.toLocaleString('vi-VN') : order?.totalAmount?.toLocaleString('vi-VN')}.000 ₫`}
                </span>
            </p>
            <p className={cx('checkout-info__item', 'checkout-info__tax')}>Đã bao gồm thuế giá trị gia tăng.</p>
            <p className={cx('checkout-info__item', 'checkout-info__poli')}>
                Miễn phí giao hàng áp dụng cho tất cả các đơn hàng nhận tại cửa hàng (Click & Collect).
                <img src={icon.info} alt='' className={cx('checkout-info__poli--icon')} />
            </p>
            {children}
        </div>
    );
}

export default CheckoutInfo;
