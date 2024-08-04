import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import icon from '~/assets/icons';
import { ModalAddress, ModalCard, ModalPass, ModalPhone, PaymentCard } from '~/components';
import { Link } from 'react-router-dom';
import useUserInfo from '~/hooks/useUseInfo';
import { Fragment, useState } from 'react';
import { getBankCard, getUser } from '~/apis/users.api';
import { useQuery } from 'react-query';

const cx = classNames.bind(styles);

function Profile() {
    const [updatePhone, setUpdatePhone] = useState(false);
    const [updateAddress, setUpdateAddress] = useState(false);
    const [updatePass, setUpdatePass] = useState(false);
    const [updateCard, setUpdateCard] = useState(false);

    // console.log(updatePhone);

    const userInfo = useUserInfo();
    const userId = userInfo?.userId;

    const { data: bankCard } = useQuery({
        queryKey: ['bankCard', userId],
        queryFn: () => getBankCard(userId).then((response) => response.data?.bankCards[0]),
        enabled: !!userId
    });

    const { data: user } = useQuery({
        queryKey: ['userInfo', userId],
        queryFn: () => getUser(userId).then((response) => response.data),
        enabled: !!userId
    });

    // console.log(user);

    const handleOpenPhoneUpdate = () => setUpdatePhone(true);
    const handleClosePhoneUpdate = () => setUpdatePhone(false);

    const handleOpenAddressUpdate = () => setUpdateAddress(true);
    const handleCloseAddressUpdate = () => setUpdateAddress(false);

    const handleOpenPassUpdate = () => setUpdatePass(true);
    const handleClosePassUpdate = () => setUpdatePass(false);

    const handleOpenCardUpdate = () => setUpdateCard(true);
    const handleCloseCardUpdate = () => setUpdateCard(false);

    return (
        <div className={cx('profile-info')}>
            <div className={cx('row gy-4')}>
                <div className={cx('col-12')}>
                    <h2 className={cx('profile-info__heading')}>Thông tin Tài khoản</h2>
                    <p className={cx('profile-info__desc')}>Bấm vào từng mục để chỉnh sửa</p>
                    <div className={cx('row row-cols-2 gy-2')}>
                        <div className={cx('col')}>
                            <Link to='#!'>
                                <article className={cx('account-info')}>
                                    <div className={cx('account-info__icon')}>
                                        <img src={icon.mail} alt='email' className={cx('account-info__icon--img')} />
                                    </div>
                                    <div>
                                        <h3 className={cx('account-info__title')}>Địa chỉ Email</h3>
                                        <p className={cx('account-info__desc')}>{userInfo?.email}</p>
                                    </div>
                                </article>
                            </Link>
                        </div>
                        <div className={cx('col')}>
                            <Link to='#!' onClick={handleOpenPhoneUpdate}>
                                <article className={cx('account-info')}>
                                    <div className={cx('account-info__icon')}>
                                        <img src={icon.phone} alt='phone' className={cx('account-info__icon--img')} />
                                    </div>
                                    <div>
                                        <h3 className={cx('account-info__title')}>Số điện thoại</h3>
                                        <p className={cx('account-info__desc')}>+ {user?.phoneNumber}</p>
                                    </div>
                                </article>
                                <ModalPhone show={updatePhone} onClose={handleClosePhoneUpdate} />
                            </Link>
                        </div>
                        <div className={cx('col')}>
                            <Link to='#!' onClick={handleOpenAddressUpdate}>
                                <article className={cx('account-info')}>
                                    <div className={cx('account-info__icon')}>
                                        <img
                                            src={icon.location}
                                            alt='address'
                                            className={cx('account-info__icon--img')}
                                        />
                                    </div>
                                    <div>
                                        <h3 className={cx('account-info__title')}>Địa chỉ</h3>
                                        <p className={cx('account-info__desc')}>
                                            {user?.city !== 'Chưa đăng ký'
                                                ? `${user?.houseNumber}, ${user?.district}, ${user?.ward}, ${user?.city}`
                                                : 'Chưa đăng ký'}
                                        </p>
                                    </div>
                                </article>
                                <ModalAddress show={updateAddress} onClose={handleCloseAddressUpdate} />
                            </Link>
                        </div>
                        <div className={cx('col')}>
                            <Link to='#!' onClick={handleOpenPassUpdate}>
                                <article className={cx('account-info')}>
                                    <div className={cx('account-info__icon')}>
                                        <img
                                            src={icon.finger}
                                            alt='password'
                                            className={cx('account-info__icon--img')}
                                        />
                                    </div>
                                    <div>
                                        <h3 className={cx('account-info__title')}>Mật Khẩu</h3>
                                        <p className={cx('account-info__desc')}>************</p>
                                    </div>
                                </article>
                                <ModalPass show={updatePass} onClose={handleClosePassUpdate} />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={cx('col-12')}>
                    <h2 className={cx('profile-info__heading')}>Thông tin Thẻ</h2>
                    <p className={cx('profile-info__desc')}>Phương thức thanh toán</p>
                    {bankCard ? (
                        <div onClick={handleOpenCardUpdate}>
                            <PaymentCard
                                cardNumber={bankCard?.cardNumber}
                                cardholderName={bankCard?.cardholderName}
                                bankName={bankCard?.bankName}
                                expiryDate={bankCard?.expiryDate}
                            />
                        </div>
                    ) : (
                        <Link to='#!' className={cx('new-card')} onClick={handleOpenCardUpdate}>
                            <img src={icon.plus} alt='new-card' className={cx('new-card__icon')} />
                            <p className={cx('new-card__text')}>Thêm thẻ thanh toán</p>
                            {/* <ModalCard show={updateCard} onClose={handleCloseCardUpdate} /> */}
                        </Link>
                    )}
                    <ModalCard show={updateCard} onClose={handleCloseCardUpdate} />
                </div>
            </div>
        </div>
    );
}

export default Profile;
