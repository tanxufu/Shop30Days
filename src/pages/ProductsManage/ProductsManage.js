import icon from '~/assets/icons';
import styles from './ProductsManage.module.scss';
import classNames from 'classnames/bind';
import { Button, ModalDelete, ModalImage } from '~/components';
import { Link } from 'react-router-dom';
import { useQueryString } from '~/utils/utils';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getProducts, updateProduct } from '~/apis/products.api';
import { useState } from 'react';
import { showToastMessage } from '~/utils/toast';

const cx = classNames.bind(styles);

function ProductsManage() {
    const queryClient = useQueryClient();
    const queryString = useQueryString();
    const page = Number(queryString.page) || 1;
    const limit = Number(queryString.limit) || 7;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [productInputs, setProductInputs] = useState({});

    const handleModalOpen = (productId) => {
        setSelectedProductId(productId);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setSelectedProductId(null);
        setModalOpen(false);
    };

    const handleModalDeleteOpen = (productId) => {
        setSelectedProductId(productId);
        setModalDelete(true);
    };

    const handleModalDeleteClose = () => {
        setSelectedProductId(null);
        setModalDelete(false);
    };

    // lấy orders
    const queryKey = ['products', page, limit];
    const { data } = useQuery({
        queryKey: queryKey,
        queryFn: () => getProducts(page, 7)
    });

    // console.log(data?.data?.products);
    const products = data?.data?.products || {};

    const totalProducts = Number(data?.data?.totalItems || 0);
    const totalPages = Math.ceil(totalProducts / 9);

    // update sản phẩm
    const handleInputChange = (productId, field, value) => {
        setProductInputs((prevState) => ({
            ...prevState,
            [productId]: {
                ...prevState[productId],
                [field]: value
            }
        }));
    };

    const { mutate: updateProductMutation } = useMutation(
        ({ productId, data }) => {
            console.log('Updating product with data:', { productId, data });
            return updateProduct({ productId, data });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['products'], { page, limit });
                showToastMessage('success', 'Cập nhật thành công');
            },
            onError: (error) => {
                console.log(error);
                showToastMessage('error', 'Cập nhật thất bại');
            }
        }
    );

    const handleUpdateProduct = ({
        productId,
        name,
        description,
        price,
        stock,
        colorHex,
        colorName,
        categoryId,
        imageUrl
    }) => {
        const updatedProduct = {
            name: productInputs[productId]?.name ?? name,
            description: productInputs[productId]?.description ?? description,
            price: productInputs[productId]?.price ?? price,
            stock: productInputs[productId]?.stock ?? stock,
            colorHex: productInputs[productId]?.colorHex ?? colorHex,
            colorName: productInputs[productId]?.colorName ?? colorName,
            categoryId: productInputs[productId]?.categoryId ?? categoryId,
            imageUrl: productInputs[productId]?.imageUrl ?? imageUrl
        };

        console.log(data);
        updateProductMutation({
            productId,
            data: updatedProduct
        });
    };

    return (
        <div className={cx('manage')}>
            <div className={cx('manage__top')}>
                <h1 className={cx('manage__heading')}>QUẢN LÝ SẢN PHẨM</h1>
                <div className={cx('manage__act')}>
                    <div className={cx('manage__search')}>
                        <input className={cx('manage__search--input')} type='text' placeholder='Tìm kiếm sản phẩm' />
                        <button className={cx('manage__search--btn')}>
                            <img src={icon.search} alt='search' className={cx('manage__search--icon')} />
                        </button>
                    </div>
                    <Button white medium>
                        Thêm sản phẩm
                    </Button>
                </div>
            </div>

            {/* content */}
            <div className={cx('products-manage')}>
                <ul className={cx('products-manage__list')}>
                    <li className={cx('products-manage__item', 'products-manage__head')}>
                        <div className={cx('row row-cols-9')}>
                            <div className={cx('col')}>
                                <p className={cx('products-manage__title')}>Mã</p>
                            </div>
                            <div className={cx('col-2')}>
                                <p className={cx('products-manage__title')}>Tên sản phẩm</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('products-manage__title')}>Giá</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('products-manage__title')}>Kho</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('products-manage__title')}>Mã màu</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('products-manage__title')}>Tên màu</p>
                            </div>
                            <div className={cx('col')}>
                                <p className={cx('products-manage__title')}>Category</p>
                            </div>

                            <div className={cx('col-2')}></div>
                        </div>
                    </li>

                    {Array.isArray(products) &&
                        products?.map((product) => (
                            <li key={product?.productId} className={cx('products-manage__item')}>
                                <div className={cx('row row-cols-9')}>
                                    <div className={cx('col')}>
                                        <p className={cx('products-manage__data')}>{product?.productId}</p>
                                    </div>
                                    <div className={cx('col-2')}>
                                        <button
                                            className={cx('products-manage__data', 'products-manage__link')}
                                            onClick={() => handleModalOpen(product?.productId)}
                                        >
                                            {product?.name}
                                        </button>
                                        <ModalImage
                                            show={modalOpen}
                                            onClose={handleModalClose}
                                            productId={selectedProductId}
                                        />
                                    </div>
                                    <div className={cx('col')}>
                                        <p className={cx('products-manage__data')}>
                                            <input
                                                type='text'
                                                value={productInputs[product?.productId]?.price ?? product?.price}
                                                className={cx(
                                                    'products-manage__input',
                                                    'products-manage__input--price'
                                                )}
                                                onChange={(e) =>
                                                    handleInputChange(product?.productId, 'price', e.target.value)
                                                }
                                            />
                                            &nbsp; .000 ₫
                                        </p>
                                    </div>
                                    <div className={cx('col')}>
                                        <p className={cx('products-manage__data')}>
                                            <input
                                                type='text'
                                                value={productInputs[product?.productId]?.stock ?? product?.stock}
                                                className={cx('products-manage__input')}
                                                onChange={(e) =>
                                                    handleInputChange(product?.productId, 'stock', e.target.value)
                                                }
                                            />
                                        </p>
                                    </div>
                                    <div className={cx('col')}>
                                        <p className={cx('products-manage__data')}>
                                            <input
                                                type='text'
                                                value={productInputs[product?.productId]?.colorHex ?? product?.colorHex}
                                                className={cx('products-manage__input')}
                                                onChange={(e) =>
                                                    handleInputChange(product?.productId, 'colorHex', e.target.value)
                                                }
                                            />
                                        </p>
                                    </div>
                                    <div className={cx('col')}>
                                        <p className={cx('products-manage__data')}>
                                            <input
                                                type='text'
                                                value={
                                                    productInputs[product?.productId]?.colorName ?? product?.colorName
                                                }
                                                className={cx('products-manage__input')}
                                                onChange={(e) =>
                                                    handleInputChange(product?.productId, 'colorName', e.target.value)
                                                }
                                            />
                                        </p>
                                    </div>
                                    <div className={cx('col')}>
                                        <p className={cx('products-manage__data')}>
                                            {product?.categoryId === 0
                                                ? 'Áo Thun'
                                                : product.categoryId === 1
                                                  ? 'Áo Sơ mi'
                                                  : product.categoryId === 2
                                                    ? 'Áo Polo'
                                                    : product.categoryId === 3
                                                      ? 'Áo Khoác'
                                                      : product.categoryId === 10
                                                        ? 'Quần Short'
                                                        : product.categoryId === 11
                                                          ? 'Quần Dài'
                                                          : null}
                                        </p>
                                    </div>
                                    <div className={cx('col-2')}>
                                        <div className={cx('products-manage__act')}>
                                            <Button
                                                primary
                                                small
                                                maxWith='60px'
                                                onClick={() => {
                                                    handleUpdateProduct({
                                                        productId: product?.productId,
                                                        name: product?.name,
                                                        description: product?.description,
                                                        price: product?.price,
                                                        stock: product?.stock,
                                                        colorHex: product?.colorHex,
                                                        colorName: product?.colorName,
                                                        categoryId: product?.categoryId,
                                                        imageUrl: product?.imageUrl
                                                    });
                                                }}
                                            >
                                                Cập nhật
                                            </Button>
                                            <Button
                                                warn
                                                small
                                                maxWidth={80}
                                                minWith={80}
                                                onClick={() => handleModalDeleteOpen(product?.productId)}
                                            >
                                                Xóa
                                                <ModalDelete
                                                    show={modalDelete}
                                                    onClose={handleModalDeleteClose}
                                                    productId={selectedProductId}
                                                />
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
                                {page === 1 || totalProducts === 0 ? (
                                    <span className={cx('pagination__previous')}></span>
                                ) : (
                                    <Link
                                        to={`/productsmanage?page=${page - 1}`}
                                        className={cx('pagination__previous')}
                                    >
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
                                                to={`/productsmanage?page=${pageNumber}`}
                                            >
                                                {pageNumber}
                                            </Link>
                                        </li>
                                    );
                                })}

                            <li>
                                {page === totalPages || totalProducts === 0 || totalProducts === undefined ? (
                                    <span className={cx('pagination__next')}></span>
                                ) : (
                                    <Link to={`/productsmanage?page=${page + 1}`} className={cx('pagination__next')}>
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

export default ProductsManage;
