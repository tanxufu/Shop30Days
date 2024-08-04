import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './ChangePass.module.scss';
import { Button, FormGroup, Logo } from '~/components';
import { schema } from '~/utils/rules';
import { useState } from 'react';
import { changePass } from '~/apis/users.api';
import { showToastMessage } from '~/utils/toast';

const cx = classNames.bind(styles);

const passSchema = schema.pick(['email', 'password', 'confirmPassword']);

function ChangePass() {
    const [passChange, setPassChange] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(passSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await changePass({
                email: data.email,
                NewPassword: data.password,
                ConfirmNewPassword: data.confirmPassword
            });
            setPassChange(true);
            // console.log(response.data);
        } catch (error) {
            const errorResponse = error.response?.data || 'Lỗi Server: Đổi mật khẩu thất bại!';
            // console.log(errorResponse);
            if (errorResponse === 'Email không tồn tại') {
                setError('errorEmail', {
                    type: 'server',
                    message: errorResponse
                });
            } else {
                showToastMessage('error', errorResponse);
            }
        }
    });

    if (passChange) {
        return (
            <div className={cx('container')}>
                <div className={cx('changepass-success')}>
                    <div className={cx('changepass-success__inner')}>
                        <div className={cx('changepass-success__box', 'success')}>
                            <div className={cx('success__icon')}></div>
                            <p className={cx('success__message')}>Mật khẩu đã được thay đổi thành công!</p>
                            <div className={cx('changepass-success__btn')}>
                                <Button primary to='/login'>
                                    Quay lại trang Đăng nhập
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('changepass')}>
            <div className={cx('changepass__title')}>QUÊN MẬT KHẨU</div>
            <form className={cx('form')} noValidate onSubmit={onSubmit}>
                <FormGroup
                    label={'Địa Chỉ Email'}
                    type={'email'}
                    name={'email'}
                    register={register}
                    errorMessage={errors.email?.message || errors.errorEmail?.message}
                    placeholder={'Nhập email của bạn'}
                    minWith={'368px'}
                    mrBottom={'8px'}
                    mrTop={'32px'}
                />

                <FormGroup
                    label={'Mật Khẩu Mới'}
                    type={'password'}
                    name={'password'}
                    register={register}
                    errorMessage={errors.password?.message}
                    placeholder={'Nhập mật khẩu mới của bạn'}
                    minWith={'368px'}
                    mrBottom={'16px'}
                    mrTop={'8px'}
                />

                <FormGroup
                    label={'Xác Nhận Mật Khẩu'}
                    type={'password'}
                    name={'confirmPassword'}
                    register={register}
                    errorMessage={errors.confirmPassword?.message}
                    placeholder={'Xác nhận mật khẩu mới của bạn'}
                    minWith={'368px'}
                    mrBottom={'16px'}
                    mrTop={'8px'}
                />

                <Button primary full>
                    Đổi mật khẩu
                </Button>
            </form>

            <div>
                <Link to='/' className={cx('changepass__link')}>
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
}

export default ChangePass;
