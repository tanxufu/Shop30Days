import classNames from 'classnames/bind';
import styles from './ModalPass.module.scss';
import { createPortal } from 'react-dom';
import { changePass } from '~/apis/users.api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '~/utils/rules';
import FormGroup from '../FormGroup';
import Button from '../Button';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation } from 'react-query';
import useUserInfo from '~/hooks/useUseInfo';
import { showToastMessage } from '~/utils/toast';

const cx = classNames.bind(styles);

const passSchema = schema.pick(['email', 'password', 'confirmPassword']);

function ModalPass({ onClose, show }) {
    const userInfo = useUserInfo();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(passSchema)
    });

    const updateMutation = useMutation((data) => changePass(data), {
        onSuccess: async () => {
            onClose();
            // navigate('/profile');

            showToastMessage('success', 'Mật khẩu đã được cập nhật');
            console.log('toast');
        },
        onError: (error) => {
            const errorResponse = error?.message || 'Lỗi Server: Cập nhật mật khẩu thất bại';
            console.log(errorResponse);

            showToastMessage('error', 'Lỗi Server: Cập nhật mật khẩu thất bại');
        }
    });

    const onSubmit = handleSubmit((data) => {
        const storedEmail = userInfo.email;

        console.log(storedEmail);

        if (data.email !== storedEmail) {
            setError('email', {
                type: 'manual',
                message: 'Email không trùng khớp'
            });
            return;
        }

        updateMutation.mutate({
            email: data.email,
            NewPassword: data.password,
            ConfirmNewPassword: data.confirmPassword
        });
    });

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return createPortal(
        <div className={cx('update-pass', 'modal', { modal__show: show })} onClick={handleModalClick}>
            <div className={cx('modal__content')}>
                <h2 className={cx('modal__name')}>Cập nhật Mật khẩu</h2>
                <form className={cx('modal__form')} onSubmit={onSubmit} noValidate>
                    <FormGroup
                        label={'Địa Chỉ Email'}
                        type={'email'}
                        name={'email'}
                        register={register}
                        errorMessage={errors.email?.message || errors.email?.message}
                        placeholder={'Nhập email của bạn'}
                        minWith={'368px'}
                        mrBottom={'8px'}
                        mrTop={'20px'}
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
                    <div className={cx('modal__act')}>
                        <Button primary minWith='174px' type='submit'>
                            Cập nhật
                        </Button>
                        <Button warn minWith='174px' onClick={onClose} type='button'>
                            Hủy
                        </Button>
                    </div>
                </form>
            </div>
            <div className={cx('modal__overlay')} onClick={onClose}></div>
        </div>,
        document.getElementById('modal-root')
    );
}

export default ModalPass;
