import classNames from 'classnames/bind';
import styles from './History.module.scss';
import useUserInfo from '~/hooks/useUseInfo';
import { useQuery } from 'react-query';
import { getUserOder } from '~/apis/products.api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useQueryString } from '~/utils/utils';
import icon from '~/assets/icons';
import { ScrollToTop } from '~/components';

const cx = classNames.bind(styles);

function History() {
    const userInfo = useUserInfo();
    const userId = userInfo?.userId;
    // console.log(userId);

    const queryString = useQueryString();
    const page = Number(queryString.page) || 1;
    const limit = Number(queryString.limit) || 2;

    // console.log(limit, page);

    const { data: order } = useQuery({
        queryKey: ['order', userId, page, limit],
        queryFn: () => getUserOder(userId, page, limit)
    });

    const orders = order?.data?.orders;
    // console.log(orders);

    const totalOrders = Number(order?.data?.totalOrders || 0);
    const totalPages = Math.ceil(totalOrders / 2);
    // console.log(totalOrders, totalPages);

    const formatOrderDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'yyyy-MM-dd HH:mm');
    };

    return (
        <div className={cx('history')}>
            <ScrollToTop />
            <h2 className={cx('history__heading')}>Lịch sử Đơn Hàng</h2>
            <p className={cx('history__desc')}>Bấm vào mã đơn hàng để xem chi tiết đơn hàng</p>
            <p className={cx('history__title')}>
                BẠN CÓ TỔNG &nbsp;<span className={cx('history__number')}>{totalOrders}</span>&nbsp;&nbsp;ĐƠN HÀNG
            </p>
            <ul className={cx('history__list')}>
                {Array.isArray(orders) &&
                    orders?.map((order) => (
                        <li key={order?.orderId} className={cx('history__item')}>
                            <section className={cx('history-info')}>
                                <p className={cx('history-info__main')}>
                                    Mã đơn hàng: &nbsp;
                                    <Link to={`/order?${order?.orderId}`} className={cx('history-info__order')}>
                                        {' '}
                                        {order?.orderId}
                                    </Link>
                                </p>
                                <p className={cx('history-info__list')}>
                                    Ngày đặt hàng: &nbsp;
                                    <span className={cx('history-info__span')}>
                                        {formatOrderDate(order?.orderDate)}
                                    </span>
                                </p>
                                <p className={cx('history-info__list')}>
                                    Trạng thái đơn hàng: &nbsp;
                                    <span className={cx('history-info__span')}>
                                        {order?.deliStatus === 'received'
                                            ? 'Đã nhận hàng'
                                            : order?.deliStatus === 'accept'
                                              ? 'Đang chuẩn bị'
                                              : order?.deliStatus === 'delivering' && order?.deliveryMethodId === 'oac'
                                                ? 'Đã có tại cửa hàng'
                                                : 'Đang vận chuyển'}
                                    </span>
                                </p>
                                <p className={cx('history-info__list')}>
                                    Tình trạng thanh toán: &nbsp;
                                    <span className={cx('history-info__span')}>
                                        {order?.payStatus === true ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </p>
                                <p className={cx('history-info__list')}>
                                    Hình thức: &nbsp;
                                    <span className={cx('history-info__span')}>
                                        {order?.deliveryMethodId === 'delivery'
                                            ? 'Giao tới địa chỉ'
                                            : 'Nhận tại của hàng'}
                                    </span>
                                </p>
                                <p className={cx('history-info__list')}>
                                    Thời gian nhận dự kiến: &nbsp;
                                    <br />
                                    Từ&nbsp;
                                    <span className={cx('history-info__span')}>
                                        {order?.deliveryMethodId === 'oac' ? '1 - 3 ngày' : '2 - 4 ngày'}
                                    </span>
                                    &nbsp;được tính kể từ thời điểm đơn hàng được xác nhận thành công
                                </p>
                                <p className={cx('history-info__list')}>
                                    Đơn vị giao hàng: &nbsp;
                                    <span className={cx('history-info__span')}>Giao Hàng Nhanh</span>
                                </p>
                            </section>
                        </li>
                    ))}
            </ul>
            <div className={cx('pagination')}>
                <nav>
                    <ul className={cx('pagination__controller')}>
                        <li>
                            {page === 1 || order?.data?.length === 0 ? (
                                <span className={cx('pagination__previous')}></span>
                            ) : (
                                <Link to={`/history?page=${page - 1}`} className={cx('pagination__previous')}>
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
                                            to={`/history?page=${pageNumber}`}
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
                                <Link to={`/history?page=${page + 1}`} className={cx('pagination__next')}>
                                    <img alt='' src={icon.next} className='pagination__icon' />
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default History;
