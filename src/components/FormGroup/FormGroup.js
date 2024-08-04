import styles from './FormGroup.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function FormGroup({
    label,
    type,
    name,
    register,
    errorMessage,
    placeholder,
    minWith,
    maxWith,
    mrBottom,
    mrTop,
    onChange,
    value,
    maxLength,
    autoFocus
}) {
    return (
        <div className={cx('form__group')} style={{ marginBottom: mrBottom, marginTop: mrTop }}>
            <label>
                <p className={cx('form__label')}>{label}</p>
                <input
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    className={cx('form__input')}
                    style={{ minWidth: minWith, maxWidth: maxWith }}
                    {...register(name)}
                    onChange={onChange}
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                />
            </label>
            <p className={cx('form__error')}>{errorMessage}</p>
        </div>
    );
}

export default FormGroup;
