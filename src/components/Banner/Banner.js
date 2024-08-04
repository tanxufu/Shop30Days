import classNames from 'classnames/bind';
import styles from './Banner.module.scss';
import { useEffect, useState } from 'react';
import image from '~/assets/images';

const cx = classNames.bind(styles);

function Banner() {
    const [bannerIndex, setBannerIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const banners = [
        <img src={image.banner1} alt='banner' className={cx('banner__img')} />,
        <img src={image.banner2} alt='banner' className={cx('banner__img')} />,
        <img src={image.banner3} alt='banner' className={cx('banner__img')} />
    ];

    const setCurrentBanner = (index) => {
        setBannerIndex(index);
    };

    return (
        <div className={cx('banner')}>
            <div className={cx('banner__inner')}>
                {banners.map((banner, index) => (
                    <div
                        key={index}
                        className={cx('banner__item', {
                            'banner__item--active': index === bannerIndex
                        })}
                        style={{ display: index === bannerIndex ? 'block' : 'none' }}
                    >
                        {banner}
                    </div>
                ))}
            </div>
            <div className={cx('banner__dot--list')}>
                {banners.map((_, index) => (
                    <span
                        key={index}
                        className={cx('banner__dot', { 'banner__dot--active': index === bannerIndex })}
                        onClick={() => setCurrentBanner(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}

export default Banner;
