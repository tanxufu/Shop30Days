import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '~/utils/rules';
import styles from './Register.module.scss';
import { Button, FormGroup } from '~/components';
import http from '~/utils/http';
import { Slide, toast } from 'react-toastify';
import { showToastMessage } from '~/utils/toast';
import { useMutation, useQueryClient } from 'react-query';
import { addUser, getUser } from '~/apis/users.api';
import { date } from 'yup';

const cx = classNames.bind(styles);

const registerSchema = schema.pick(['name', 'email', 'phoneNumber', 'password', 'confirmPassword']);

function Register() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(registerSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        console.log(data);
        try {
            const response = await addUser(data);

            console.log(response.data);
            localStorage.setItem('userInfo', JSON.stringify(response.data));

            navigate('/');
        } catch (error) {
            console.log(error);
            const errorResponse = error.response?.data?.message || 'Lỗi Server: Đăng ký thất bại';
            console.log(errorResponse);

            if (errorResponse === 'Email đã được sử dụng') {
                setError('errorEmail', {
                    type: 'server',
                    message: errorResponse
                });
            } else {
                showToastMessage('error', errorResponse);
            }
        }
    });

    return (
        <div className={cx('signup')}>
            <form className={cx('form', 'signup-form')} noValidate onSubmit={onSubmit}>
                <div className={cx('signup__title')}>ĐĂNG KÝ</div>
                <FormGroup
                    label={'Tên Người Dùng'}
                    type={'text'}
                    name={'name'}
                    register={register}
                    errorMessage={errors.name?.message}
                    placeholder={'Nhập tên của bạn'}
                    minWith={'368px'}
                    mrBottom={'8px'}
                    mrTop={'28px'}
                />
                <FormGroup
                    label={'Địa Chỉ Email'}
                    type={'email'}
                    name={'email'}
                    register={register}
                    errorMessage={errors.email?.message || errors.errorEmail?.message}
                    placeholder={'Nhập email của bạn'}
                    minWith={'368px'}
                    mrBottom={'8px'}
                    mrTop={'8px'}
                />

                <FormGroup
                    label={'Số Điện Thoại'}
                    type={'text'}
                    name={'phoneNumber'}
                    register={register}
                    errorMessage={errors.phoneNumber?.message}
                    placeholder={'Nhập số điện thoại của bạn'}
                    minWith={'368px'}
                    mrBottom={'8px'}
                    mrTop={'8px'}
                />

                <FormGroup
                    label={'Mật Khẩu'}
                    type={'password'}
                    name={'password'}
                    register={register}
                    errorMessage={errors.password?.message}
                    placeholder={'Nhập mật khẩu của bạn'}
                    minWith={'368px'}
                    mrBottom={'8px'}
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
                    Đăng ký
                </Button>
            </form>
            <div className={cx('signup__login')}>
                <div>
                    Bạn đã có tài khoản?
                    <Link to='/login' className={cx('signup__link')}>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
