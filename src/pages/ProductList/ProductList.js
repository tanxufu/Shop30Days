import classNames from 'classnames/bind';
import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import styles from './ProductList.module.scss';
import { ProductCard, ProductLoading, Title } from '~/components';
import image from '~/assets/images';
import icon from '~/assets/icons';
import { getProducts } from '~/apis/products.api';
import { useQueryString } from '~/utils/utils';

const cx = classNames.bind(styles);

function ProductList() {
    const queryString = useQueryString();
    const page = Number(queryString.page) || 1;
    const categoryId = queryString.categoryId !== undefined ? Number(queryString.categoryId) : null;
    const [activeSize, setActiveSize] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // console.log(categoryId);

    // console.log(queryString);
    // console.log(page);
    const queryKey = ['products', page, categoryId, minPrice, maxPrice];
    const { data, isLoading } = useQuery({
        queryKey: queryKey,
        queryFn: () => getProducts(page, 12, categoryId, minPrice, maxPrice)
    });

    // console.log(data);
    // console.log(categoryId);

    const products = data?.data?.products;

    const totalProducts = Number(data?.data?.totalItems || 0);
    const totalPages = Math.ceil(totalProducts / 12);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page, searchParams, categoryId]);

    const handlePriceFilterChange = (minPrice, maxPrice) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks

        searchParams.set('minPrice', minPrice);
        searchParams.set('maxPrice', maxPrice);
        searchParams.set('page', 1);

        setSearchParams(searchParams);

        setMinPrice(minPrice);
        setMaxPrice(maxPrice);
    };

    const categories = [
        { id: 0, name: 'Áo Thun' },
        { id: 1, name: 'Áo Sơ Mi' },
        { id: 2, name: 'Áo Polo' },
        { id: 3, name: 'Áo Khoác' },
        { id: 10, name: 'Quần Short' },
        { id: 11, name: 'Quần Dài' }
    ];

    const sizes = [
        { id: 0, name: 'XS' },
        { id: 1, name: 'S' },
        { id: 2, name: 'M' },
        { id: 3, name: 'L' },
        { id: 4, name: 'XL' },
        { id: 5, name: 'XXL' }
    ];
    // console.log(totalPages);

    // const [products, setProducts] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     setIsLoading(true);
    //     getProducts(1, 9)
    //         .then((res) => {
    //             console.log(res.data);
    //             setProducts(res?.data?.products);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching products:', error);
    //         })
    //         .finally(() => {
    //             setIsLoading(false);
    //         });
    // }, []);

    return (
        <div className={cx('products')}>
            <div className={cx('container')}>
                <div className={cx('products__inner')}>
                    <div className={cx('row gx-4')}>
                        {/* filter */}
                        <div className={cx('col-3')}>
                            <div className={cx('products__filter')}>
                                <div className={cx('filter')}>
                                    {/* list */}
                                    <div className={cx('filter__group')}>
                                        <Title Type='h2' font='1.8rem' bg={'var(--white)'}>
                                            Danh Mục
                                        </Title>
                                        <ul className={cx('filter__list')}>
                                            {categories.map((category) => {
                                                const isActive = categoryId === category.id;

                                                return (
                                                    <li
                                                        key={category.id}
                                                        className={cx('filter__item', {
                                                            'filter__item--active': isActive
                                                        })}
                                                    >
                                                        <Link to={`/productlist?categoryId=${category.id}`}>
                                                            {category.name}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                    {/* size */}
                                    <div className={cx('filter__group')}>
                                        <Title Type='h2' font='1.8rem' bg={'var(--white)'}>
                                            Kích Thước
                                        </Title>
                                        <div className={cx('filter__size')}>
                                            <div className={cx('row row-cols-3 gy-1 gx-1')}>
                                                {sizes.map((size) => {
                                                    const isActive = activeSize === size.id;
                                                    return (
                                                        <div key={size.id} className={cx('col')}>
                                                            <div onClick={() => setActiveSize(size.id)}>
                                                                <div
                                                                    className={cx('filter__size-opt', {
                                                                        'filter__size-opt--active': isActive
                                                                    })}
                                                                >
                                                                    {size.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* price */}
                                    <div className={cx('filter__group')}>
                                        <Title Type='h2' font='1.8rem' bg={'var(--white)'}>
                                            Giá
                                        </Title>
                                        <div className={cx('filter__list')}>
                                            <div className={cx('filter__check')}>
                                                <input
                                                    type='radio'
                                                    name='price-filter'
                                                    className={cx('filter__check-input')}
                                                    id='price-filter-1'
                                                    hidden
                                                    onChange={() => handlePriceFilterChange(299, 499)}
                                                />
                                                <label className={cx('filter__check-label')} htmlFor='price-filter-1'>
                                                    299.000&nbsp;₫ - 499.000&nbsp;₫
                                                </label>
                                            </div>
                                            <div className={cx('filter__check')}>
                                                <input
                                                    className={cx('filter__check-input')}
                                                    type='radio'
                                                    name='price-filter'
                                                    id='price-filter-2'
                                                    onChange={() => handlePriceFilterChange(499, 699)}
                                                    hidden
                                                />
                                                <label className={cx('filter__check-label')} htmlFor='price-filter-2'>
                                                    499.000&nbsp;₫ - 699.000&nbsp;₫
                                                </label>
                                            </div>
                                            <div className={cx('filter__check')}>
                                                <input
                                                    className={cx('filter__check-input')}
                                                    type='radio'
                                                    name='price-filter'
                                                    id='price-filter-3'
                                                    onChange={() => handlePriceFilterChange(699, 899)}
                                                    hidden
                                                />
                                                <label className={cx('filter__check-label')} htmlFor='price-filter-3'>
                                                    699.000&nbsp;₫ - 899.000&nbsp;₫
                                                </label>
                                            </div>
                                            <div className={cx('filter__check')}>
                                                <input
                                                    className={cx('filter__check-input')}
                                                    type='radio'
                                                    name='price-filter'
                                                    id='price-filter-4'
                                                    onChange={() => handlePriceFilterChange(900, null)}
                                                    hidden
                                                />
                                                <label className={cx('filter__check-label')} htmlFor='price-filter-4'>
                                                    Trên 899.000&nbsp;₫
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* stock */}
                                    <div className={cx('filter__group')}>
                                        <Title Type='h2' font='1.8rem' bg={'var(--white)'}>
                                            Tình Trạng
                                        </Title>
                                        <div className={cx('filter__list')}>
                                            <div className={cx('filter__check')}>
                                                <input
                                                    className={cx('filter__check-input')}
                                                    type='checkbox'
                                                    name='instockonly'
                                                    id='instock'
                                                    hidden
                                                />
                                                <label className={cx('filter__check-label')} htmlFor='instock'>
                                                    Sản Phẩm Còn Hàng
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* product list */}
                        <div className={cx('col-9')}>
                            <div className={cx('grayline')}></div>
                            <Title Type='h1'>DANH SÁCH SẢN PHẨM</Title>
                            <div className={cx('products__list')}>
                                {data?.data?.products.length === 0 && (
                                    <p className={cx('products__notfound')}>Không có sản phẩm phù hợp</p>
                                )}
                                {isLoading && (
                                    <div className={cx('row row-cols-3 gy-4 gx-3')}>
                                        {Array.from({ length: 9 }).map((_, index) => (
                                            <div key={index} className={cx('col')}>
                                                <ProductLoading />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/*------------------- products ------------------- */}
                                {!isLoading && (
                                    <Fragment>
                                        <div className={cx('row row-cols-3 gy-4 gx-3')}>
                                            {products?.map((product) => {
                                                const imageUrl = image[`${product.imageUrl}1`];

                                                return (
                                                    <div key={product.productId} className={cx('col')}>
                                                        <ProductCard
                                                            id={product.productId}
                                                            imageUrl={imageUrl}
                                                            name={product.name}
                                                            price={`${product.price}.000 ₫`}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className={cx('products__pagination')}>
                                            <nav>
                                                <ul className={cx('products__pagination--controller')}>
                                                    <li>
                                                        {page === 1 || data?.data?.products.length === 0 ? (
                                                            <span
                                                                className={cx('products__pagination--previous')}
                                                            ></span>
                                                        ) : (
                                                            <Link
                                                                to={`/productlist?page=${page - 1}${categoryId ? `&categoryId=${categoryId}` : ''}`}
                                                                className={cx('products__pagination--previous')}
                                                            >
                                                                <img
                                                                    alt=''
                                                                    src={icon.previous}
                                                                    className='products__pagination--icon'
                                                                />
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
                                                                        className={cx('products__pagination--btn', {
                                                                            'products__pagination--current': isActive
                                                                        })}
                                                                        to={`/productlist?page=${pageNumber}${categoryId ? `&categoryId=${categoryId}` : ''}`}
                                                                    >
                                                                        {pageNumber}
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}

                                                    <li>
                                                        {page === totalPages || data?.data?.products.length === 0 ? (
                                                            <span className={cx('products__pagination--next')}></span>
                                                        ) : (
                                                            <Link
                                                                to={`/productlist?page=${page + 1}${categoryId ? `&categoryId=${categoryId}` : ''}`}
                                                                className={cx('products__pagination--next')}
                                                            >
                                                                <img
                                                                    alt=''
                                                                    src={icon.next}
                                                                    className='products__pagination--icon'
                                                                />
                                                            </Link>
                                                        )}
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
