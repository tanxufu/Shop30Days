import classNames from 'classnames/bind';
import styles from './ModalCard.module.scss';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '~/utils/rules';
import FormGroup from '../FormGroup';
import Button from '../Button';
import { useMutation, useQueryClient } from 'react-query';
import useUserInfo from '~/hooks/useUseInfo';
import { addBankCard, getUser } from '~/apis/users.api';
import { showToastMessage } from '~/utils/toast';
import { useState } from 'react';

const cx = classNames.bind(styles);

const cardSchema = schema.pick(['cardNumber', 'cardholderName', 'expiryDate', 'cvv', 'bankName']);

function ModalCard({ onClose, show }) {
    const queryClient = useQueryClient();
    const [valueUpper, setValueUpper] = useState('');
    const [valueNumber, setValueNumber] = useState('');
    const [valueNum, setValueNum] = useState('');
    const userInfo = useUserInfo();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(cardSchema)
    });

    const updateMutation = useMutation(({ userId, data }) => addBankCard(userId, data), {
        onSuccess: async () => {
            try {
                queryClient.invalidateQueries(['bankCard', userInfo?.userId]);
                onClose();
                // window.location.reload();
                showToastMessage('success', 'Cập nhật Thẻ thành công');
            } catch (error) {
                console.log(error);
            }
        },
        onError: (error) => {
            const errorResponse = error || 'Lỗi Server: Cập nhật thẻ ngân hàng thất bại!';
            console.log(errorResponse);
            showToastMessage('error', 'Lỗi Server: Cập nhật thẻ ngân hàng thất bại!');
        }
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        updateMutation.mutate({ userId: userInfo?.userId, data });
    });

    const handleChangeUpperCase = (event) => {
        let value = event.target.value;
        value = value.toUpperCase();
        setValueUpper(value);
    };

    const handleChangeNumberCase = (event) => {
        let value = event.target.value;

        value = value.replace(/[^0-9]/g, '');

        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }

        event.target.value = value;

        setValueNumber(value);
    };

    const handleChangeNumCase = (event) => {
        let value = event.target.value;

        value = value.replace(/[^0-9]/g, '');

        value = value.replace(/(.{4})/g, '$1 ');

        value = value.trim();

        event.target.value = value;

        setValueNum(value);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return createPortal(
        <div className={cx('update-card', 'modal', { modal__show: show })} onClick={handleModalClick}>
            <div className={cx('modal__content')}>
                <h2 className={cx('modal__name')}>Cập nhật Thẻ thanh toán</h2>
                <form className={cx('modal__form')} onSubmit={onSubmit} noValidate>
                    <FormGroup
                        label={'Tên ngân hàng'}
                        type={'text'}
                        name={'bankName'}
                        register={register}
                        errorMessage={errors.bankName?.message}
                        placeholder={'Nhập tên ngân hàng'}
                        minWith={'368px'}
                        mrBottom={'8px'}
                        mrTop={'20px'}
                    />

                    <FormGroup
                        label={'Tên chủ thẻ'}
                        value={valueUpper}
                        type={'text'}
                        name={'cardholderName'}
                        register={register}
                        errorMessage={errors.cardholderName?.message}
                        onChange={handleChangeUpperCase}
                        placeholder={'Nhập tên chủ thẻ'}
                        minWith={'368px'}
                        mrBottom={'12px'}
                        mrTop={'8px'}
                    />

                    <FormGroup
                        label={'Số tài khoản'}
                        type={'text'}
                        name={'cardNumber'}
                        value={valueNum}
                        register={register}
                        errorMessage={errors.cardNumber?.message}
                        onChange={handleChangeNumCase}
                        placeholder={'Nhập số tài khoản'}
                        minWith={'368px'}
                        mrBottom={'12px'}
                        mrTop={'8px'}
                    />

                    <div className={cx('update-form__row')}>
                        <FormGroup
                            label={'Ngày hết hạn'}
                            type={'text'}
                            value={valueNumber}
                            name={'expiryDate'}
                            register={register}
                            errorMessage={errors.expiryDate?.message}
                            onChange={handleChangeNumberCase}
                            maxLength={5}
                            placeholder={'MM/YY'}
                            maxWith={'169px'}
                            mrBottom={'8px'}
                            mrTop={'8px'}
                        />

                        <FormGroup
                            label={'CVV'}
                            type={'text'}
                            name={'cvv'}
                            register={register}
                            errorMessage={errors.cvv?.message}
                            maxLength={3}
                            placeholder={'Nhập Số cvv'}
                            maxWith={'169px'}
                            mrBottom={'8px'}
                            mrTop={'8px'}
                        />
                    </div>
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

export default ModalCard;
