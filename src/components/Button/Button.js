import styles from './Button.module.scss';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Button({
    to,
    children,
    primary,
    white = false,
    warn = false,
    full = false,
    small = false,
    medium = false,
    disable = false,
    onClick,
    type,
    form,
    minWith,
    maxWidth
}) {
    let Comp = 'button';
    const props = {
        onClick,
        type,
        form
    };

    if (to) {
        props.to = to;
        Comp = Link;
    }

    const classes = cx('default', {
        primary,
        white,
        warn,
        full,
        medium,
        disable,
        small
    });

    return (
        <Comp className={classes} {...props} style={{ minWidth: minWith, width: maxWidth }}>
            {children}
        </Comp>
    );
}

export default Button;
