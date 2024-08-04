import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './Login.module.scss';
import { Button, FormGroup, Logo } from '~/components';
import { schema } from '~/utils/rules';
import http from '~/utils/http';
import { showToastMessage } from '~/utils/toast';

const cx = classNames.bind(styles);

const loginSchema = schema.pick(['email', 'password']);

function Login() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        // console.log('onSubmit');
        try {
            const response = await http.post('/users/login', data);
            localStorage.setItem('userInfo', JSON.stringify(response.data));

            const admin = response?.data?.typeAccount === 'ad';
            if (admin) {
                localStorage.setItem('admin', true);
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            const errorResponse = error?.response?.data || 'Lỗi Server: Đăng nhập thất bại';

            console.log(errorResponse);

            if (errorResponse === 'Email không tồn tại') {
                setError('errorEmail', {
                    type: 'server',
                    message: errorResponse
                });
            } else if (errorResponse === 'Mật khẩu không chính xác') {
                setError('errorPassword', {
                    type: 'server',
                    message: errorResponse
                });
            } else {
                showToastMessage('error', errorResponse);
            }
        }
    });
    // console.log('re-render');
    // console.log(errors.errorUser?.message);
    // console.log(errors.errorPassword?.message);

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <div className={cx('login')}>
            <Logo />
            <form
                id='loginForm'
                className={cx('form', 'sign-form')}
                noValidate
                onSubmit={onSubmit}
                onKeyDown={onKeyDown}
            >
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
                    autoFocus
                />

                <FormGroup
                    label={'Mật Khẩu'}
                    type={'password'}
                    name={'password'}
                    register={register}
                    errorMessage={errors?.password?.message || errors.errorPassword?.message}
                    placeholder={'Nhập mật khẩu của bạn'}
                    minWith={'368px'}
                    mrBottom={'16px'}
                    mrTop={'8px'}
                />

                <Button form='loginForm' primary full type='submit'>
                    Đăng nhập
                </Button>
            </form>
            <div className={cx('login__signin')}>
                <div>
                    <Link to='/changepass' className={cx('login__link')}>
                        Quên mật khẩu?
                    </Link>
                </div>
                <div>
                    Bạn chưa có tài khoản?
                    <Link to='/register' className={cx('login__link')}>
                        Đăng ký
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
