import icon from '~/assets/icons';
import styles from './Admin.module.scss';
import classNames from 'classnames/bind';
import { Button } from '~/components';
import { Link } from 'react-router-dom';
import { useQueryString } from '~/utils/utils';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getOders, updateOderStatus } from '~/apis/products.api';
import { format } from 'date-fns';
import { useState } from 'react';
import { showToastMessage } from '~/utils/toast';

const cx = classNames.bind(styles);

function Admin() {
    const queryClient = useQueryClient();
    const queryString = useQueryString();
    const page = Number(queryString.page) || 1;
    const limit = Number(queryString.limit) || 9;
    const [orderStatus, setOrderStatus] = useState({});

    // lấy orders
    const { data: order } = useQuery({
        queryKey: ['order', page, limit],
        queryFn: () => getOders(page, limit)
    });
    const orders = order?.data?.orders;

    const totalOrders = Number(order?.data?.totalOrders || 0);
    // console.log(totalOrders);
    const totalPages = Math.ceil(totalOrders / 9);

    // cập nhật đơn hàng
    const { mutate: updateOrderStatus } = useMutation(
        (data) => updateOderStatus(data.orderId, data.deliStatus, data.payStatus),
        {
            onSuccess: () => {
                // console.log('vô');
                queryClient.invalidateQueries(['order'], page, limit);
                showToastMessage('success', 'Cập nhật thành công');
            },
            onError: (error) => {
                console.log(error);
                showToastMessage('error', 'Cập nhật thất bại');
            }
        }
    );

    const handleUpdateStatus = (data) => {
        console.log(data);
        updateOrderStatus(data);
    };

    const formatOrderDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'yyyy-MM-dd HH:mm');
    };

    return (
        <div className={cx('manage')}>
            <div className={cx('manage__top')}>
                <h1 className={cx('manage__heading')}>QUẢN LÝ ĐƠN HÀNG</h1>
                <div className={cx('manage__search')}>
                    <input className={cx('manage__search--input')} type='text' placeholder='Tìm kiếm đơn hàng' />
                    <button className={cx('manage__search--btn')}>
                        <img src={icon.search} alt='search' className={cx('manage__search--icon')} />
                    </button>
                </div>
            </div>

            {/* content */}
            <div className={cx('order-manage')}>
                <ul className={cx('order-manage__list')}>
                    <li className={cx('order-manage__item', 'order-manage__head')}>
                        <div className={cx('row row-cols-8')}>
                            <div className={cx('col')}>
                                <p className={cx('order-manage__title')}>Mã đơn hàng</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('order-manage__title')}>Ngày đặt hàng</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('order-manage__title')}>Số lượng</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('order-manage__title')}>Tổng thanh toán</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('order-manage__title')}>Hình thức</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('order-manage__title')}>Giao hàng</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('order-manage__title')}>Hình thức</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('order-manage__title')}>Tình trạng </p>
                            </div>
                            <div className={cx('col')}></div>
                        </div>
                    </li>
                    {orders?.map((order) => (
                        <li key={order?.orderId} className={cx('order-manage__item')}>
                            <div className={cx('row row-cols-8')}>
                                <div className={cx('col')}>
                                    <Link to='#!' className={cx('order-manage__data', 'order-manage__link')}>
                                        {order?.orderId}
                                    </Link>
                                </div>
                                <div className={cx('col')}>
                                    <p className={cx('order-manage__data')}>{formatOrderDate(order?.orderDate)}</p>
                                </div>
                                <div className={cx('col')}>
                                    <p className={cx('order-manage__data')}>{order?.quantity} &nbsp; Sản phẩm</p>
                                </div>
                                <div className={cx('col')}>
                                    <p className={cx('order-manage__data')}>
                                        {(order?.totalAmount).toLocaleString('vi-VN')}.000 ₫
                                    </p>
                                </div>
                                <div className={cx('col')}>
                                    <p className={cx('order-manage__data')}>
                                        {order?.paymentMethodId === 'card' ? 'Thẻ ngân hàng' : 'Tiền mặt'}
                                    </p>
                                </div>
                                <div className={cx('col')}>
                                    {order?.deliStatus === 'received' ? (
                                        <label className={cx('order-manage__select')} htmlFor='deli-slct'>
                                            <select id={`deli-slct-${order.orderId}`} required='required' disabled>
                                                <option value='received' disabled selected='selected'>
                                                    Đã nhận hàng
                                                </option>
                                            </select>
                                        </label>
                                    ) : order?.deliStatus === 'delivering' ? (
                                        <label className={cx('order-manage__select')} htmlFor='deli-slct'>
                                            <select id={`deli-slct-${order.orderId}`} required='required'>
                                                <option value='accept' disabled>
                                                    Đang chuẩn bị
                                                </option>
                                                <option value='delivering' selected='selected'>
                                                    {order?.deliveryMethodId === 'oac'
                                                        ? 'Đã có hàng'
                                                        : 'Đang vận chuyển'}
                                                </option>

                                                <option value='received'>Đã nhận hàng</option>
                                            </select>
                                        </label>
                                    ) : (
                                        <label className={cx('order-manage__select')} htmlFor='deli-slct'>
                                            <select id={`deli-slct-${order.orderId}`} required='required'>
                                                <option value='accept' disabled selected='selected'>
                                                    Đang chuẩn bị
                                                </option>
                                                <option value='delivering'>
                                                    {order?.deliveryMethodId === 'oac'
                                                        ? 'Đã có hàng'
                                                        : 'Đang vận chuyển'}
                                                </option>
                                                <option value='received'>Đã nhận hàng</option>
                                            </select>
                                        </label>
                                    )}
                                </div>
                                <div className={cx('col')}>
                                    <p className={cx('order-manage__data')}>
                                        {order?.deliveryMethodId === 'delivery'
                                            ? 'Giao tới địa chỉ'
                                            : 'Nhận tại cửa hàng'}
                                    </p>
                                </div>
                                <div className={cx('col')}>
                                    {order?.payStatus === true ? (
                                        <label className={cx('order-manage__select')} htmlFor='pay-slct'>
                                            <select id={`pay-slct-${order.orderId}`} required='required' disabled>
                                                <option value='true' disabled='disabled' selected='selected'>
                                                    Đã thanh toán
                                                </option>
                                            </select>
                                        </label>
                                    ) : (
                                        <label className={cx('order-manage__select')} htmlFor='pay-slct'>
                                            <select id={`pay-slct-${order.orderId}`} required='required'>
                                                <option value='false' selected='selected'>
                                                    Chưa thanh toán
                                                </option>
                                                <option value='true'>Đã thanh toán</option>
                                            </select>
                                        </label>
                                    )}
                                </div>
                                <div className={cx('col')}>
                                    <div className={cx('order-manage__act')}>
                                        <Button
                                            primary
                                            small
                                            maxWith='60px'
                                            onClick={() => {
                                                const deliStatus = document.getElementById(
                                                    `deli-slct-${order.orderId}`
                                                ).value;
                                                const payStatus =
                                                    document.getElementById(`pay-slct-${order.orderId}`).value ===
                                                    'true';
                                                handleUpdateStatus({
                                                    orderId: order?.orderId,
                                                    deliStatus: deliStatus,
                                                    payStatus: payStatus
                                                });
                                            }}
                                        >
                                            Cập nhật
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className={cx('pagination')}>
                    <nav>
                        <ul className={cx('pagination__controller')}>
                            <li>
                                {page === 1 || totalOrders === 0 ? (
                                    <span className={cx('pagination__previous')}></span>
                                ) : (
                                    <Link to={`/admin?page=${page - 1}`} className={cx('pagination__previous')}>
                                        <img alt='' src={icon.previous} className='pagination__icon' />
                                    </Link>
                                )}
                            </li>
                            {Array(totalPages)
                                .fill(0)
                                .map((_, index) => {
                                    const pageNumber = index + 1;
                                    const isActive = page === pageNumber;

                                    return (
                                        <li key={pageNumber}>
                                            <Link
                                                className={cx('pagination__btn', {
                                                    pagination__current: isActive
                                                })}
                                                to={`/admin?page=${pageNumber}`}
                                            >
                                                {pageNumber}
                                            </Link>
                                        </li>
                                    );
                                })}

                            <li>
                                {page === totalPages || totalOrders === 0 || totalOrders === undefined ? (
                                    <span className={cx('pagination__next')}></span>
                                ) : (
                                    <Link to={`/admin?page=${page + 1}`} className={cx('pagination__next')}>
                                        <img alt='' src={icon.next} className='pagination__icon' />
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Admin;
