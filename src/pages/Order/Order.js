import classNames from 'classnames/bind';
import styles from './Order.module.scss';
import useUserInfo from '~/hooks/useUseInfo';
import icon from '~/assets/icons';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getUser } from '~/apis/users.api';
import { useQueryString } from '~/utils/utils';
import { getOderDetails } from '~/apis/products.api';
import image from '~/assets/images';

const cx = classNames.bind(styles);

function Order() {
    const queryString = useQueryString();
    const orderId = Object.keys(queryString)[0];
    // console.log(orderId);

    const userInfo = useUserInfo();
    const userId = userInfo?.userId;

    // console.log(userInfo);

    const { data: user } = useQuery({
        queryKey: ['userInfo', userId],
        queryFn: () => getUser(userId).then((response) => response.data),
        enabled: !!userId
    });
    // console.log(user);

    const { data: orders } = useQuery({
        queryKey: ['order', userId],
        queryFn: () => getOderDetails(orderId)
    });

    const order = orders?.data || {};
    const orderItems = orders?.data?.items ? orders.data.items : {};
    const productsPrice = order?.deliveryMethodId === 'delivery' ? order?.totalAmount - 20 : order?.totalAmount;

    // console.log(productsPrice);
    // console.log(orderItems);

    return (
        <div className={cx('order')}>
            <h2 className={cx('order__heading')}>
                <Link to='/history' className={cx('order__heading--back')}>
                    <img src={icon.arrowLeft} alt='arrow-left' />
                </Link>
                Chi tiết đơn hàng
            </h2>
            <p className={cx('order__desc')}>
                Mã đơn hàng: <span className={cx('order__id')}>&nbsp;{order?.orderId}</span>
            </p>
            <ul className={cx('order__list')}>
                <li className={cx('order__item')}>
                    <section className={cx('order-info')}>
                        <h2 className={cx('order-info__main')}>ĐỊA CHỈ GIAO HÀNG</h2>
                        <p className={cx('order-info__desc')}>
                            <span className={cx('order-info__span')}>{user?.name}</span>
                        </p>
                        <p className={cx('order-info__desc')}>
                            {order?.deliveryMethodId === 'delivery' ? (
                                `${user?.houseNumber}, ${user?.district}, ${user?.ward}, ${user?.city}`
                            ) : (
                                <span className={cx('order-info__span')}>Nhận tại cửa hàng</span>
                            )}
                        </p>
                        <p className={cx('order-info__desc')}>
                            Số điện thoại : <span className={cx('order-info__span')}>+ {user?.phoneNumber}</span>
                        </p>
                    </section>
                </li>
                <li className={cx('order__item')}>
                    <section className={cx('order-info')}>
                        <h2 className={cx('order-info__main')}>PHƯƠNG THỨC THANH TOÁN</h2>
                        <p className={cx('order-info__desc')}>
                            <span className={cx('order-info__span')}>
                                {order?.paymentMethodId === 'card'
                                    ? 'Thanh toán bằng Thẻ ngân hàng'
                                    : 'Thanh toán Tiền mặt khi nhận hàng'}
                            </span>
                        </p>
                    </section>
                </li>
                <li className={cx('order__item')}>
                    <section className={cx('order-info')}>
                        <h2 className={cx('order-info__main')}>TỔNG ĐƠN HÀNG</h2>
                        {Array.isArray(orderItems) &&
                            orderItems?.map((orderItem) => {
                                return (
                                    <article key={orderItem?.orderItemId} className={cx('order-product')}>
                                        <div className={cx('order-product__img-wrap')}>
                                            <img
                                                src={image[`${orderItem?.product?.imageUrl}1`]}
                                                alt='product'
                                                className={cx('order-product__img')}
                                            />
                                        </div>
                                        <div className={cx('order-product__info')}>
                                            <p className={cx('order-product__name')}>{orderItem?.product?.name}</p>
                                            <p className={cx('order-product__label')}>
                                                Màu sắc :{' '}
                                                <span className={cx('order-product__span')}>
                                                    {orderItem?.product?.colorName}
                                                </span>
                                            </p>

                                            <div className={cx('order-product__col')}>
                                                <p className={cx('order-product__bill')}>
                                                    Giá :{' '}
                                                    <span className={cx('order-product__span')}>
                                                        {orderItem?.product?.price}.000 ₫
                                                    </span>
                                                </p>
                                                <p className={cx('order-product__bill')}>
                                                    Số lượng :{' '}
                                                    <span className={cx('order-product__span')}>
                                                        {orderItem?.productQuantity}
                                                    </span>
                                                </p>
                                                <p className={cx('order-product__total')}>
                                                    TỔNG :{' '}
                                                    <span className={cx('order-product__price')}>
                                                        {orderItem?.price?.toLocaleString('vi-VN')}.000 ₫
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                    </section>
                </li>
                <li className={cx('order__item')}>
                    <section className={cx('order-info')}>
                        <div className={cx('order-info__row')}>
                            <p className={cx('order-info__desc')}>Tổng phí sản phẩm</p>
                            <p className={cx('order-info__span')}>{productsPrice?.toLocaleString('vi-VN')} .000 ₫</p>
                        </div>
                        <div className={cx('order-info__row')}>
                            <p className={cx('order-info__desc')}>Phí vận chuyển</p>
                            <p className={cx('order-info__span')}>
                                {order?.deliveryMethodId === 'delivery' ? 20 : 0}.000 ₫
                            </p>
                        </div>
                    </section>
                </li>
                <li className={cx('order__item')}>
                    <section className={cx('order-info')}>
                        <div className={cx('order-info__row')}>
                            <h2 className={cx('order-info__total')}>TỔNG ĐƠN HÀNG</h2>
                            <p className={cx('order-info__total')}>
                                {order?.totalAmount?.toLocaleString('vi-VN')}.000 ₫
                            </p>
                        </div>
                        <div className={cx('order-info__row')}>
                            <p className={cx('order-info__tax')}>Đã bao gồm thuế giá trị gia tăng</p>
                            <p className={cx('order-info__span')}>{(productsPrice * 0.08).toFixed(2)}0 ₫</p>
                        </div>
                    </section>
                </li>
            </ul>
        </div>
    );
}

export default Order;
