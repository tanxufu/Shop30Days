import classNames from 'classnames/bind';
import styles from './ModalImage.module.scss';
import { createPortal } from 'react-dom';
import { useQuery } from 'react-query';
import { getProduct } from '~/apis/products.api';
import image from '~/assets/images';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function ModalImage({ onClose, show, productId }) {
    const [currentImage, setCurrentImage] = useState(null);

    const { data } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProduct(productId)
    });

    // console.log(data?.data?.imageUrl);

    const product = data?.data;

    // handle thumb click
    useEffect(() => {
        if (product && product.imageUrl) {
            const initialImage = image[`${product.imageUrl}1`];
            setCurrentImage(initialImage);
        }
    }, [product]);

    const handleThumbClick = (img) => {
        setCurrentImage(img);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const productImageIndex = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

    return createPortal(
        <div className={cx('modal-image', 'modal', { modal__show: show })} onClick={handleModalClick}>
            <div className={cx('modal__content')}>
                <div className={cx('moadal-slides')}>
                    {productImageIndex.map((imageNum) => {
                        const imageUrl = image[`${product?.imageUrl}${imageNum.id}`];
                        return (
                            <div
                                key={imageNum.id}
                                className={cx('moadal-slides__img-wrap')}
                                onClick={() => handleThumbClick(imageUrl)}
                            >
                                <img src={imageUrl} alt={product?.data?.name} className={cx('moadal-slides__img')} />
                            </div>
                        );
                    })}
                </div>
                <div className={cx('modal__current-img')}>
                    <img src={currentImage} alt={product?.data?.name} className={cx('modal__thumb')} />
                </div>
            </div>
            <div className={cx('modal__overlay')} onClick={onClose}></div>
        </div>,
        document.getElementById('modal-root')
    );
}

export default ModalImage;
