import classNames from 'classnames/bind';
import styles from './ModalAddress.module.scss';
import { createPortal } from 'react-dom';
import useUserInfo from '~/hooks/useUseInfo';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '~/utils/rules';
import FormGroup from '../FormGroup';
import Button from '../Button';
import { useMutation, useQueryClient } from 'react-query';
import { getUser, updateAddress } from '~/apis/users.api';
import { showToastMessage } from '~/utils/toast';

const cx = classNames.bind(styles);

const addressSchema = schema.pick(['city', 'ward', 'district', 'houseNumber']);

function ModalAddress({ onClose, show }) {
    const queryClient = useQueryClient();
    const userInfo = useUserInfo();

    const userId = userInfo?.userId;

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(addressSchema)
    });

    const updateMutation = useMutation(({ userId, address }) => updateAddress(userId, address), {
        onSuccess: async () => {
            try {
                const response = await getUser(userId);
                const updatedUser = response.data;

                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                queryClient.invalidateQueries(['userInfo', userId]);

                onClose();
                // window.location.reload();
                showToastMessage('success', 'Cập nhật Địa chỉ thành công');
            } catch (error) {
                console.log(error);
            }
        },
        onError: (error) => {
            const errorResponse = error?.message || 'Lỗi Server: Cập nhật địa chỉ thất bại!';
            console.log(errorResponse);
            showToastMessage('error', 'Lỗi Server: Cập nhật địa chỉ thất bại!');
        }
    });

    const onSubmit = handleSubmit((data) => {
        // console.log(data);
        updateMutation.mutate({ userId: userId, address: data });
    });

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return createPortal(
        <div className={cx('update-address', 'modal', { modal__show: show })} onClick={handleModalClick}>
            <div className={cx('modal__content')}>
                <h2 className={cx('modal__name')}>
                    {userInfo?.city === 'Chưa đăng ký' ? 'Cập nhật địa chỉ' : 'Thay đổi địa chỉ'}
                </h2>
                <form className={cx('modal__form')} onSubmit={onSubmit} noValidate>
                    <FormGroup
                        label={'Thành phố'}
                        type={'text'}
                        name={'city'}
                        register={register}
                        errorMessage={errors.city?.message}
                        placeholder={'Nhập Thành phố'}
                        minWith={'368px'}
                        mrBottom={'8px'}
                        mrTop={'20px'}
                    />

                    <FormGroup
                        label={'Quận/Huyện'}
                        type={'text'}
                        name={'district'}
                        register={register}
                        errorMessage={errors.district?.message}
                        placeholder={'Nhập Quận/Huyện'}
                        minWith={'368px'}
                        mrBottom={'8px'}
                        mrTop={'8px'}
                    />

                    <FormGroup
                        label={'Phường/Xã'}
                        type={'text'}
                        name={'ward'}
                        register={register}
                        errorMessage={errors.ward?.message}
                        placeholder={'Nhập Phường/Xã'}
                        minWith={'368px'}
                        mrBottom={'8px'}
                        mrTop={'8px'}
                    />

                    <FormGroup
                        label={'Số nhà, đường'}
                        type={'text'}
                        name={'houseNumber'}
                        register={register}
                        errorMessage={errors.houseNumber?.message || errors.errorResponse?.message}
                        placeholder={'Nhập Số nhà và đường'}
                        minWith={'368px'}
                        mrBottom={'16px'}
                        mrTop={'8px'}
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

export default ModalAddress;
