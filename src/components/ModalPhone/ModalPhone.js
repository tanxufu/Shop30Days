import classNames from 'classnames/bind';
import styles from './ModalPhone.module.scss';
import { createPortal } from 'react-dom';
import { useMutation, useQueryClient } from 'react-query';
import { getUser, updatePhoneNumber } from '~/apis/users.api';
import useUserInfo from '~/hooks/useUseInfo';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '~/utils/rules';
import FormGroup from '../FormGroup';
import Button from '../Button';
import { showToastMessage } from '~/utils/toast';

const cx = classNames.bind(styles);

const phoneSchema = schema.pick(['phoneNumber']);

function ModalPhone({ onClose, show }) {
    const queryClient = useQueryClient();
    const userInfo = useUserInfo();
    const userId = userInfo?.userId;

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(phoneSchema)
    });

    const updateMutation = useMutation(({ userId, phoneNumber }) => updatePhoneNumber(userId, phoneNumber), {
        onSuccess: async () => {
            const response = await getUser(userId);
            const updatedUser = response.data;

            // console.log(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            queryClient.invalidateQueries(['userInfo', userId]);
            onClose();
            // window.location.reload();
            showToastMessage('success', 'Cập nhật Số điện thoại thành công');
        },
        onError: (error) => {
            const errorResponse = error?.message || 'Lỗi Server: Cập nhật số điện thoại thất bại!';
            console.log(errorResponse);
            showToastMessage('error', 'Lỗi Server: Cập nhật số điện thoại thất bại!');
        }
    });

    const onSubmit = handleSubmit((data) => {
        updateMutation.mutate({ userId: userId, phoneNumber: data.phoneNumber });
    });

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return createPortal(
        <div className={cx('update-phone', 'modal', { modal__show: show })} onClick={handleModalClick}>
            <div className={cx('modal__content')}>
                <h2 className={cx('modal__name')}>Cập nhật Số điện thoại</h2>
                <form className={cx('modal__form')} onSubmit={onSubmit} noValidate>
                    <FormGroup
                        label={'Số điện thoại mới'}
                        type={'text'}
                        name={'phoneNumber'}
                        register={register}
                        errorMessage={errors.phoneNumber?.message || errors.errorResponse?.message}
                        placeholder={'Nhập số điện thoại mới của bạn'}
                        minWith={'368px'}
                        mrBottom={'16px'}
                        mrTop={'32px'}
                    />

                    <div className={cx('modal__act')}>
                        <Button primary minWith='174px' type='submit'>
                            Cập nhật
                        </Button>
                        <Button warn minWith='174px' type='button' onClick={onClose}>
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

export default ModalPhone;
