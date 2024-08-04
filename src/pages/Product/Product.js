import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import image from '~/assets/images';
import icon from '~/assets/icons';
import { Button, Title } from '~/components';
import { useEffect, useState } from 'react';
import { useQueryString } from '~/utils/utils';
import { addToCart, getProduct } from '~/apis/products.api';
import { useQuery, useQueryClient } from 'react-query';
import useUserInfo from '~/hooks/useUseInfo';
import { showToastMessage } from '~/utils/toast';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Product() {
    const queryClient = useQueryClient();
    // set số lượng
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState(null);

    // lấy id sản phẩm
    const queryString = useQueryString();
    const productId = Object.keys(queryString)[0];

    // size
    const [activeSize, setActiveSize] = useState(null);
    const userInfo = useUserInfo();

    const userId = userInfo?.userId;

    //  get product
    const { data } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProduct(productId)
    });

    const product = data?.data;
    // console.log(product);

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

    // console.log(quantity);

    const handleAddToCart = async () => {
        try {
            const response = await addToCart(userId, productId, quantity);
            if (response?.status === 200) {
                showToastMessage('success', 'Thêm vào giỏ hàng thành công');
                queryClient.invalidateQueries(['product', userId]);
            }
        } catch (error) {
            console.log(error);
            // alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const categories = {
        0: 'Áo Thun',

        1: 'Áo Sơ Mi',

        2: 'Áo Polo',

        3: 'Áo Khoác',

        10: 'Quần Short',

        11: 'Quần Dài'
    };

    const category = categories[product?.categoryId];
    // console.log(category);

    const productImageIndex = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const sizes = [
        { id: 0, name: 'XS' },
        { id: 1, name: 'S' },
        { id: 2, name: 'M' },
        { id: 3, name: 'L' },
        { id: 4, name: 'XL' },
        { id: 5, name: 'XXL' }
    ];

    return (
        <div className={cx('product')}>
            <div className={cx('container')}>
                <div className={cx('product__inner')}>
                    {/* top */}
                    <div className={cx('product__top')}>
                        <div className={cx('breadcrumb')}>
                            <ul className={cx('breadcrumb__list')}>
                                <li className={cx('breadcrumb__item')}>
                                    <Link to='/productlist' className={cx('breadcrumb__link')}>
                                        Sản Phẩm
                                    </Link>
                                    <img src={icon.arrowRight} className={cx('breadcrumb__icon')} />
                                </li>
                                <li className={cx('breadcrumb__item')}>
                                    {category && (
                                        <Link
                                            to={`/productlist?categoryId=${product?.categoryId}`}
                                            className={cx('breadcrumb__link', 'breadcrumb__link--active')}
                                        >
                                            {category}
                                        </Link>
                                    )}

                                    <img src={icon.arrowRight} className={cx('breadcrumb__icon')} />
                                </li>
                            </ul>
                        </div>
                        <div className={cx('row gx-4')}>
                            {/* media */}
                            <div className={cx('col-7')}>
                                <div className={cx('product__media')}>
                                    <nav className={cx('product__nav')}>
                                        {productImageIndex.map((imageNum) => {
                                            const imageUrl = image[`${product?.imageUrl}${imageNum.id}`];
                                            const isActive = currentImage === imageUrl;
                                            return (
                                                <div
                                                    key={imageNum.id}
                                                    className={cx('', {
                                                        'product__nav--border': isActive
                                                    })}
                                                >
                                                    <div
                                                        key={imageNum.id}
                                                        className={cx('product__nav--thumb-wrap')}
                                                        onClick={() => handleThumbClick(imageUrl)}
                                                    >
                                                        <img
                                                            src={imageUrl}
                                                            alt={product?.name}
                                                            className={cx('product__nav--thumb')}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </nav>
                                    <div className={cx('product__thumb-wrap')}>
                                        <img src={currentImage} alt='' className={cx('product__thumb')} />
                                    </div>
                                </div>
                            </div>

                            {/* info */}
                            <div className={cx('col-5')}>
                                <h1 className={cx('product-info__name')}>{product?.name}</h1>
                                <span className={cx('product-info__price')}>{product?.price}.000&nbsp;₫</span>
                                <div className={cx('product-info__color')}>
                                    <p className={cx('product-info__label')}>
                                        Màu Sắc :
                                        <span className={cx('product-info__color-name')}>
                                            &nbsp;&nbsp;&nbsp;{product?.colorName}
                                        </span>
                                    </p>
                                    <div
                                        className={cx('product-info__color-box')}
                                        style={{ backgroundColor: `${product?.colorHex}` }}
                                    ></div>
                                </div>

                                {/* size */}
                                <div className={cx('product-info__size')}>
                                    <p className={cx('product-info__label')}>Kích Thước :</p>
                                    <div className={cx('product-info__size-list')}>
                                        {sizes.map((size) => {
                                            const isActive = activeSize === size.id;
                                            return (
                                                <div
                                                    key={size.id}
                                                    className={cx('product-info__size-item', {
                                                        'product-info__size-item--active': isActive
                                                    })}
                                                    onClick={() => setActiveSize(size.id)}
                                                >
                                                    {size.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className={cx('product-info__quantity')}>
                                    <p className={cx('product-info__label')}>Số Lượng :</p>
                                    <div className={cx('product-quantity')}>
                                        <button
                                            className={cx('product-quantity__act')}
                                            onClick={() =>
                                                quantity === 1 ? setQuantity(1) : setQuantity(quantity - 1)
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
                                            value={quantity}
                                            className={cx('product-quantity__input')}
                                            readOnly
                                        />
                                        <button
                                            className={cx('product-quantity__act')}
                                            onClick={() =>
                                                quantity === product?.stock
                                                    ? setQuantity(product?.stock)
                                                    : setQuantity(quantity + 1)
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

                                <div className={cx('product-info__act')}>
                                    {product?.stock !== 0 ? (
                                        <Button primary minWith={'350px'} onClick={handleAddToCart}>
                                            THÊM VÀO GIỎ HÀNG
                                        </Button>
                                    ) : (
                                        <Button primary minWith={'350px'} disable>
                                            SẢN PHẨM TẠM HẾT
                                        </Button>
                                    )}

                                    <button className={cx('product-info__like', 'like-btn')}>
                                        <img
                                            src={icon.heart}
                                            className={cx('product-info__like--icon')}
                                            alt='like button'
                                        />
                                    </button>
                                </div>

                                {/* service info */}
                                <div className={cx('product-info__bottom')}>
                                    <div className={cx('row row-cols-2 gy-4')}>
                                        <div className={cx('col')}>
                                            <div className={cx('product-info__feature')}>
                                                <img src={image.ghn} className={'product-info__feature--img'} alt='' />
                                                <div>
                                                    <strong className={cx('product-info__feature--name')}>
                                                        Giao Hàng Nhanh
                                                    </strong>
                                                    <p>Từ 1 - 3 ngày</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('col')}>
                                            <div className={cx('product-info__feature')}>
                                                <img src={image.free} className={'product-info__feature--img'} alt='' />
                                                <div>
                                                    <strong className={cx('product-info__feature--name')}>
                                                        Miễn Phí Vận Chuyển
                                                    </strong>
                                                    <p>Đơn Nhận tại cửa hàng</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('col')}>
                                            <div className={cx('product-info__feature')}>
                                                <img
                                                    src={image.returns}
                                                    className={'product-info__feature--img'}
                                                    alt=''
                                                />
                                                <div>
                                                    <strong className={cx('product-info__feature--name')}>
                                                        Đổi trả linh hoạt
                                                    </strong>
                                                    <p>Không áp dụng với sản phẩm khuyến mãi</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('col')}>
                                            <div className={cx('product-info__feature')}>
                                                <img src={image.pay} className={'product-info__feature--img'} alt='' />
                                                <div>
                                                    <strong className={cx('product-info__feature--name')}>
                                                        Thanh toán dễ dàng với nhiều hình thức
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* bottom */}
                    <div className={cx('product__bottom')}>
                        <div className={cx('row gx-4')}>
                            <div className={cx('col-7')}>
                                <div className={cx('product-desc')}>
                                    <Title Type='h2'>MÔ TẢ SẢN PHẨM</Title>
                                    <p className={cx('product-desc__desc')}>{product?.description}</p>
                                </div>
                            </div>
                            <div className={cx('col-5')}>
                                <table className={cx('product-table')}>
                                    <tr>
                                        <th>XUẤT XỨ</th>
                                        <td>Việt Nam</td>
                                    </tr>
                                    <tr>
                                        <th>KÍCH THƯỚC</th>
                                        <td>Khoảng 45cm × 100cm</td>
                                    </tr>
                                    <tr>
                                        <th>NHÀ CUNG CẤP</th>
                                        <td>30 DAYS</td>
                                    </tr>
                                    <tr>
                                        <th>CHẤT LIỆU</th>
                                        <td>Vải Cotton</td>
                                    </tr>
                                    <tr>
                                        <th>TRỌNG LƯỢNG</th>
                                        <td>150 ~ 200 gram</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;
