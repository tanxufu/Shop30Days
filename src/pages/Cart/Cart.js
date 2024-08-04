import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { Button, Title } from '~/components';
import CheckoutInfo from '~/components/CheckoutInfo';
import image from '~/assets/images';
import { useState } from 'react';
import icon from '~/assets/icons';
import useUserInfo from '~/hooks/useUseInfo';
import { deleteProduct, getProductsPending, updateProductQuantity } from '~/apis/products.api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { showToastMessage } from '~/utils/toast';

const cx = classNames.bind(styles);

function Cart() {
    const [quantity, setQuantity] = useState({});
    const userInfo = useUserInfo();
    const queryClient = useQueryClient();

    const userId = userInfo?.userId;

    const { data } = useQuery({
        queryKey: ['product', userId],
        queryFn: () => getProductsPending(userId),
        staleTime: 0,
        cacheTime: 5 * 60 * 1000
    });

    const orderItems = data?.data?.items;
    // console.log(orderItems?.length);
    // console.log(data?.data);
    const status = data?.data?.deliStatus;

    // thay đổi số lượng
    const updateProductQuantityMutation = useMutation(
        ({ userId, orderItemId, quantity }) => updateProductQuantity(userId, orderItemId, quantity),
        {
            onSuccess: () => {
                console.log('success');
                queryClient.invalidateQueries(['product', userId]);
            },
            onError: (error) => {
                console.error('Lỗi cập nhật số lượng:', error);
            }
        }
    );
    const handleQuantityChange = (orderItemId, newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity((prev) => ({ ...prev, [orderItemId]: newQuantity }));
            updateProductQuantityMutation.mutate({ userId, orderItemId, quantity: newQuantity });
        }
    };

    // xóa sp
    const handleRemoveProduct = async (orderItemId) => {
        try {
            await deleteProduct(userId, orderItemId);
            queryClient.invalidateQueries(['product', userId]);
            showToastMessage('success', 'Đã xóa Sản phẩm khỏi Giỏ hàng');
        } catch (error) {
            console.error('Lỗi', error);
        }
    };

    return (
        <div className={cx('cart')}>
            <div className={cx('container')}>
                <div className={cx('cart__inner')}>
                    <div className={cx('row gx-5')}>
                        <div className={cx('col-8')}>
                            <Title Type='h1'>GIỎ HÀNG</Title>
                            {status !== 'pending' || orderItems?.length === 0 ? (
                                <p className={cx('cart__null')}>Bạn chưa có sản phẩm nào</p>
                            ) : null}

                            <ul className={cx('cart__list')}>
                                {orderItems?.map((orderItem) => {
                                    const imageUrl = image[`${orderItem?.product?.imageUrl}1`];
                                    // console.log(imageUrl);

                                    return (
                                        <li key={orderItem?.orderItemId} className={cx('product-list-card')}>
                                            <div className={cx('product-list-card__img-wrap')}>
                                                <Link to={`/product?${orderItem?.product?.productId}`}>
                                                    <img
                                                        src={imageUrl}
                                                        className={cx('product-list-card__img')}
                                                        alt={orderItem?.product?.name}
                                                    />
                                                </Link>
                                            </div>
                                            <div className={cx('product-list-card__info')}>
                                                <Link to={`/product?${orderItem?.product?.productId}`}>
                                                    <h2 className={cx('product-list-card__name')}>
                                                        {orderItem?.product?.name}
                                                    </h2>
                                                </Link>

                                                <p className={cx('product-list-card__label')}>
                                                    Màu sắc :
                                                    <span className={cx('product-list-card__color-name')}>
                                                        &nbsp;&nbsp;&nbsp;{orderItem?.product?.colorName}
                                                    </span>
                                                </p>
                                                <div className={cx('product-list-card__select')}>
                                                    {/* quantity */}
                                                    <div className={cx('product-quantity')}>
                                                        <button
                                                            className={cx('product-quantity__act')}
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    orderItem?.orderItemId,
                                                                    (quantity[orderItem?.orderItemId] ||
                                                                        orderItem?.productQuantity) - 1
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={icon.minus}
                                                                className={cx('product-quantity__icon')}
                                                                alt='minus'
                                                            />
                                                        </button>
                                                        <input
                                                            type='text'
                                                            id='product-quantity'
                                                            value={
                                                                orderItem?.productQuantity ||
                                                                quantity[orderItem?.orderItemId]
                                                            }
                                                            className={cx('product-quantity__input')}
                                                            readOnly
                                                        />
                                                        <button
                                                            className={cx('product-quantity__act')}
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    orderItem?.orderItemId,
                                                                    (quantity[orderItem?.orderItemId] ||
                                                                        orderItem?.productQuantity) + 1
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={icon.pluss}
                                                                className={cx('product-quantity__icon')}
                                                                alt='minus'
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className={cx('product-list-card__price')}>
                                                    {orderItem?.price?.toLocaleString('vi-VN')}.000&nbsp;₫
                                                </span>
                                            </div>
                                            <div className={cx('product-list-card__act')}>
                                                <button
                                                    className={cx('remove-btn')}
                                                    onClick={() => handleRemoveProduct(orderItem?.orderItemId)}
                                                >
                                                    <img src={icon.times} alt='' className={cx('remove-btn__icon')} />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className={cx('col-4')}>
                            <CheckoutInfo>
                                {status === 'pending' && orderItems?.length !== 0 ? (
                                    <Button primary full to='/checkout'>
                                        TIẾN HÀNH THANH TOÁN
                                    </Button>
                                ) : (
                                    <Button
                                        primary
                                        full
                                        onClick={() => showToastMessage('warn', 'Bạn chưa có sản phẩm trong giỏ hàng')}
                                    >
                                        TIẾN HÀNH THANH TOÁN
                                    </Button>
                                )}
                            </CheckoutInfo>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
