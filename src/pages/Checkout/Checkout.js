import classNames from 'classnames/bind';
import styles from './Checkout.module.scss';
import { Button, ModalAddress, ModalCard, PaymentCard, ScrollToTop, Title } from '~/components';
import CheckoutInfo from '~/components/CheckoutInfo';
import { useCallback, useState } from 'react';
import useUserInfo from '~/hooks/useUseInfo';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getBankCard, getUser } from '~/apis/users.api';
import { Link } from 'react-router-dom';
import icon from '~/assets/icons';
import { confirmOrder, getOderPending } from '~/apis/products.api';
import { showToastMessage } from '~/utils/toast';

const cx = classNames.bind(styles);

function Checkout() {
    const queryClient = useQueryClient();
    const [selectedDeli, setSelectedDeli] = useState('delivery');
    const [selectedPay, setSelectedPay] = useState('cash');
    const [orderSuccess, setOrderSuccess] = useState(false);

    const [updateAddress, setUpdateAddress] = useState(false);
    const [updateCard, setUpdateCard] = useState(false);

    const userInfo = useUserInfo();
    const userId = userInfo?.userId;

    const handleOpenAddressUpdate = useCallback(() => setUpdateAddress(true), []);
    const handleCloseAddressUpdate = useCallback(() => setUpdateAddress(false), []);

    const handleOpenCardUpdate = useCallback(() => setUpdateCard(true), []);
    const handleCloseCardUpdate = useCallback(() => setUpdateCard(false), []);

    // thẻ
    const { data: bankCard } = useQuery({
        queryKey: ['bankCard', userId],
        queryFn: () => getBankCard(userId).then((response) => response.data?.bankCards[0]),
        enabled: !!userId
    });

    // console.log(bankCard);

    const { data: user } = useQuery({
        queryKey: ['userInfo', userId],
        queryFn: () => getUser(userId).then((response) => response?.data),
        enabled: !!userId
    });

    // console.log(user);

    const { data: order } = useQuery({
        queryKey: ['order', userId],
        queryFn: () => getOderPending(userId)
    });

    // xác nhận đặt hàng
    const confirmOrderMutation = useMutation(
        ({ userId, paymentMethodId, deliveryMethodId }) => confirmOrder(userId, paymentMethodId, deliveryMethodId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['product', userId], { refetchActive: true });
                setOrderSuccess(true);
            },
            onError: (error) => {
                console.log(error);
                showToastMessage('error', 'Lỗi Server: Xác nhận đơn hàng thất bại!');
            }
        }
    );

    const handleConfirmOrder = () => {
        const paymentMethodId = selectedPay;
        const deliveryMethodId = selectedDeli;
        if (deliveryMethodId === 'delivery' && user?.city === 'Chưa đăng ký') {
            showToastMessage('warn', 'Vui lòng đăng ký địa chỉ giao hàng');
        } else {
            confirmOrderMutation.mutate({ userId, paymentMethodId, deliveryMethodId });
        }
    };

    if (orderSuccess) {
        return (
            <div className={cx('container')}>
                <ScrollToTop />
                <div className={cx('order-success')}>
                    <div className={cx('order-success__inner')}>
                        <div className={cx('order-success__box', 'success')}>
                            <div className={cx('success__icon')}></div>
                            <p className={cx('success__message')}>Bạn đã đặt hàng thành công!</p>
                            <div className={cx('order-success__btn')}>
                                <Button primary to='/login'>
                                    Tiếp tục mua sắm
                                </Button>
                                <Button primary to='/history'>
                                    Lịch sử Đơn hàng
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // thay dổi phương thức giao hàng
    const handleMethodDeli = (event) => {
        const value = event.target.value;
        setSelectedDeli(value);
    };

    // thay đổi phương thức thanh toán
    const payMethod = order?.data[0]?.paymentMethodId;

    const handleMethodPay = (event) => {
        const value = event.target.value;
        setSelectedPay(value);
    };

    return (
        <div className={cx('checkout')}>
            <div className={cx('container')}>
                <div className={cx('checkout__inner')}>
                    <div className={cx('breadcrumb')}>
                        <ul className={cx('breadcrumb__list')}>
                            <li className={cx('breadcrumb__item')}>
                                <Link to='/' className={cx('breadcrumb__link')}>
                                    Trang Chủ
                                </Link>
                                <img src={icon.arrowRight} className={cx('breadcrumb__icon')} />
                            </li>
                            <li className={cx('breadcrumb__item')}>
                                <Link to='/cart' className={cx('breadcrumb__link', 'breadcrumb__link--active')}>
                                    Giỏ Hàng
                                </Link>
                                <img src={icon.arrowRight} className={cx('breadcrumb__icon')} />
                            </li>
                        </ul>
                    </div>
                    <div className={cx('row gx-5')}>
                        <div className={cx('col-8')}>
                            <div className={cx('checkout__check')}>
                                {/* -----------DELI METHOD----------- */}
                                <div className={cx('checkout-deli-method')}>
                                    <Title Type='h2'>PHƯƠNG THỨC GIAO HÀNG</Title>
                                    <div className={cx('checkout-deli-method__box')}>
                                        <p className={cx('checkout-deli-method__text')}>
                                            Chọn hình thức
                                            <span className={cx('checkout-deli-method__need-more')}>
                                                &nbsp;&nbsp;Nhận tại cửa hàng&nbsp;&nbsp;
                                            </span>
                                            để được miễn phí giao hàng.
                                        </p>
                                        <div className={cx('deli-method')}>
                                            <input
                                                checked={selectedDeli === 'delivery'}
                                                onChange={handleMethodDeli}
                                                hidden
                                                type='radio'
                                                id='delivery'
                                                name='deli-method'
                                                value='delivery'
                                                className={cx('deli-method__radio')}
                                            />
                                            <label htmlFor='delivery' className={cx('deli-method__label')}>
                                                <div>
                                                    <span className={cx('deli-method__label-text')}>
                                                        Giao Đến Địa Chỉ
                                                    </span>
                                                    <span>
                                                        Phí vận chuyển&nbsp;:&nbsp;&nbsp;
                                                        <span className={cx('deli-method__price')}>20.000&nbsp;₫</span>
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className={cx('deli-method')}>
                                            <input
                                                checked={selectedDeli === 'oac'}
                                                onChange={handleMethodDeli}
                                                hidden
                                                type='radio'
                                                id='oac'
                                                name='deli-method'
                                                value='oac'
                                                className={cx('deli-method__radio')}
                                            />
                                            <label htmlFor='oac' className={cx('deli-method__label')}>
                                                <div>
                                                    <span className={cx('deli-method__label-text')}>
                                                        Nhận Tại Cửa Hàng
                                                    </span>
                                                    <span>
                                                        Phí vận chuyển&nbsp;:&nbsp;&nbsp;
                                                        <span className={cx('deli-method__price')}>MIỄN PHÍ</span>
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className={cx('deli-info')}>
                                            <p className={cx('deli-info__warn')}>
                                                {selectedDeli === 'delivery'
                                                    ? 'Giao đến địa chỉ bạn đã đăng ký'
                                                    : 'Khách hàng sẽ nhận được email thông báo khi đơn hàng có tại cửa hàng. Khách hàng sẽ sử dụng email đó để nhận hàng.'}
                                            </p>
                                            {selectedDeli === 'delivery' && (
                                                <div>
                                                    <p className={cx('deli-info__name')}>{user?.name}</p>
                                                    <p className={cx('deli-info__address')}>
                                                        {user?.city !== 'Chưa đăng ký'
                                                            ? `${user?.houseNumber}, ${user?.district}, ${user?.ward}, ${user?.city}`
                                                            : 'Chưa đăng ký'}
                                                    </p>
                                                    <p className={cx('deli-info__phone')}>
                                                        Số điện thoại&nbsp;:&nbsp;&nbsp;
                                                        <span className={cx('deli-info__phone-number')}>
                                                            + {user?.phoneNumber}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <ModalAddress show={updateAddress} onClose={handleCloseAddressUpdate} />
                                    </div>
                                    <div>
                                        {selectedDeli === 'delivery' ? (
                                            <Button white full medium onClick={handleOpenAddressUpdate}>
                                                {userInfo?.city === 'Chưa đăng ký'
                                                    ? 'Thêm địa chỉ giao hàng'
                                                    : 'Thay đổi địa chỉ giao hàng'}
                                            </Button>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>

                                {/* -----------PAY METHOD----------- */}
                                <div className={cx('checkout-pay-method')}>
                                    <Title Type='h2'>PHƯƠNG THỨC THANH TOÁN</Title>
                                    <div className={cx('checkout-pay-method__box')}>
                                        <div className={cx('checkout-pay-method__method')}>
                                            <div className={cx('pay-method')}>
                                                <input
                                                    checked={selectedPay === 'card'}
                                                    onChange={handleMethodPay}
                                                    hidden
                                                    type='radio'
                                                    id='card'
                                                    name='pay-method'
                                                    value={'card'}
                                                    className={cx('pay-method__radio')}
                                                />
                                                <label htmlFor='card' className={cx('pay-method__label')}>
                                                    <div>
                                                        <span className={cx('pay-method__label-text')}>
                                                            Thanh Toán Bằng Thẻ
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className={cx('pay-method')}>
                                                <input
                                                    checked={selectedPay === 'cash'}
                                                    onChange={handleMethodPay}
                                                    hidden
                                                    type='radio'
                                                    id='cash'
                                                    name='pay-method'
                                                    value={'cash'}
                                                    className={cx('pay-method__radio')}
                                                />
                                                <label htmlFor='cash' className={cx('pay-method__label')}>
                                                    <div>
                                                        <span className={cx('pay-method__label-text')}>
                                                            Thanh Toán Khi Nhận Hàng
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <div className={cx('pay-info')}>
                                            {selectedPay === 'card' ? (
                                                bankCard ? (
                                                    <PaymentCard
                                                        onClick={handleOpenCardUpdate}
                                                        cardNumber={bankCard?.cardNumber}
                                                        cardholderName={bankCard?.cardholderName}
                                                        bankName={bankCard?.bankName}
                                                        expiryDate={bankCard?.expiryDate}
                                                    />
                                                ) : (
                                                    <p className={cx('deli-info__warn')}>
                                                        Bạn chưa thêm thẻ thanh toán.
                                                    </p>
                                                )
                                            ) : (
                                                <p className={cx('deli-info__warn')}>
                                                    Vui lòng thanh toán bằng tiền mặt cho người vận chuyển khi đơn hàng
                                                    của bạn đã đến nơi.
                                                </p>
                                            )}
                                            <ModalCard show={updateCard} onClose={handleCloseCardUpdate} />
                                        </div>
                                    </div>
                                    {selectedPay === 'card' ? (
                                        <Button white full medium onClick={handleOpenCardUpdate}>
                                            {bankCard ? 'Thay đổi thẻ thanh toán' : 'Thêm thẻ thanh toán'}
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={cx('col-4')}>
                            <CheckoutInfo deliMethod={selectedDeli}>
                                <Button primary full onClick={handleConfirmOrder}>
                                    XÁC NHẬN ĐẶT HÀNG
                                </Button>
                            </CheckoutInfo>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
