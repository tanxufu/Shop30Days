import classNames from 'classnames/bind';
import styles from './ModalDelete.module.scss';
import { createPortal } from 'react-dom';
import { useQuery } from 'react-query';
import { getProduct } from '~/apis/products.api';
import Button from '../Button';

const cx = classNames.bind(styles);

function ModalDelete({ onClose, show, productId }) {
    const { data } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProduct(productId)
    });

    // console.log(data?.data?.imageUrl);

    const product = data?.data;

    // console.log(product?.productId);

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return createPortal(
        <div className={cx('modal-delete', 'modal', { modal__show: show })} onClick={handleModalClick}>
            <div className={cx('modal__content')}>
                <p className={cx('modal__warn')}>
                    Bạn có chắc muốn xóa sản phẩm:&nbsp;
                    <span className={cx('modal__warn--id')}>{product?.productId}</span>&nbsp;không ?
                </p>
                <div className={cx('modal__act')}>
                    <Button warn full>
                        Xóa
                    </Button>
                    <Button primary full onClick={onClose}>
                        Hủy
                    </Button>
                </div>
            </div>
            <div className={cx('modal__overlay')} onClick={onClose}></div>
        </div>,
        document.getElementById('modal-root')
    );
}

export default ModalDelete;
