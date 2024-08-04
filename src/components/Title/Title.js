import styles from './Title.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Title({ Type, children, font, bg }) {
    return (
        <div className={cx('heading')} style={{ fontSize: font, backgroundColor: bg }}>
            <Type>{children}</Type>
        </div>
    );
}

export default Title;
