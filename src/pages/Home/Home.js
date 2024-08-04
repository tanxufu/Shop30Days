import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import image from '~/assets/images';
import { Banner, Button, ProductCard, ProductLoading, Title } from '~/components';
import { useQuery } from 'react-query';
import { getProducts } from '~/apis/products.api';

const cx = classNames.bind(styles);

function Home() {
    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => getProducts(1, 4, null, null, null)
    });

    const products = data?.data?.products;

    const categories = [
        { id: 0, name: 'ÁO THUN', imageSrc: image.aothun },
        { id: 1, name: 'ÁO SƠ MI', imageSrc: image.aosomi },
        { id: 2, name: 'ÁO POLO', imageSrc: image.aopolo },
        { id: 3, name: 'ÁO KHOÁC', imageSrc: image.aokhoac },
        { id: 10, name: 'QUẦN SHORT', imageSrc: image.quanshort },
        { id: 11, name: 'QUẦN DÀI', imageSrc: image.quandai }
    ];

    return (
        <div className={cx('home')}>
            <div className={cx('container')}>
                <Banner />
                <div className={cx('new-arrivals')}>
                    <Title Type='h1'>SẢN PHẨM MỚI</Title>
                    <div className={cx('new-arrivals__list')}>
                        {data?.data?.products.length === 0 && (
                            <p className={cx('products__notfound')}>Không có sản phẩm phù hợp</p>
                        )}
                        {isLoading && (
                            <div className={cx('row row-cols-4 gx-2')}>
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <div key={index} className={cx('col')}>
                                        <ProductLoading />
                                    </div>
                                ))}
                            </div>
                        )}
                        {!isLoading && (
                            <div className={cx('row row-cols-4 gx-2')}>
                                {products?.map((product) => {
                                    const imageUrl = image[`${product.imageUrl}1`];
                                    // console.log(imageUrl);
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
                        )}
                    </div>
                    <div className={cx('new-arrivals__act')}>
                        <Button primary minWith={'200px'} to='/productlist'>
                            Xem Tất cả
                        </Button>
                    </div>

                    <div className={cx('home-cate')}>
                        <Title Type='h2'>DANH MỤC SẢN PHẨM</Title>
                        <div className={cx('home-cate__list')}>
                            <div className={cx('row row-cols-3 gy-4')}>
                                {categories.map((category) => (
                                    <div className={cx('col')} key={category.id}>
                                        <article className={cx('cate-card')}>
                                            <Link key={category.id} to={`/productlist?categoryId=${category.id}`}>
                                                <div className={cx('cate-card__img-wrap')}>
                                                    <img
                                                        src={category.imageSrc}
                                                        className={cx('cate-card__img')}
                                                        alt={category.name}
                                                    />
                                                </div>
                                                <span className={cx('cate-card__name')}>{category.name}</span>
                                            </Link>
                                        </article>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
