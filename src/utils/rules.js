import * as yup from 'yup';

export const schema = yup.object({
    email: yup
        .string()
        .required('Vui lòng nhập email')
        .email('Email không đúng định dạng')
        .min(6, 'Email có độ dài ít nhất 6 ký tự')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Email không đúng định dạng'),
    password: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu tối thiểu 6 ký tự')
        .max(128, 'Mật khẩu tối đa 128 ký tự'),
    name: yup
        .string()
        .required('Vui lòng nhập tên')
        .min(5, 'Tên tối thiểu phải có 5 ký tự')
        .max(128, 'Tên tối đa 128 ký tự'),
    phoneNumber: yup
        .string()
        .required('Vui lòng nhập số điện thoại')
        .min(10, 'Số điện thoại tối thiểu 10 ký tự')
        .matches(/^[0-9]{10,}$/, 'Số điện thoại không đúng định dạng'),
    confirmPassword: yup
        .string()
        .required('Vui lòng xác nhận mật khẩu')
        .min(6, 'Mật khẩu tối thiểu 6 ký tự')
        .max(128, 'Mật khẩu tối đa 128 ký tự')
        .oneOf([yup.ref('password')], 'Xác nhận mật khẩu không chính xác'),
    city: yup.string().required('Vui lòng nhập Thành phố'),
    district: yup.string().required('Vui lòng nhập Quận/Huyện'),
    ward: yup.string().required('Vui lòng nhập Phường/Xã'),
    houseNumber: yup.string().required('Vui lòng nhập số nhà'),
    cardNumber: yup
        .string()
        .required('Vui lòng nhập số thẻ')
        .min(16, 'Số thẻ tối thiểu 16 ký tự')
        .max(19, 'Số thẻ tối đa 19 ký tự'),
    cardholderName: yup.string().required('Vui lòng nhập tên chủ thẻ').max(128, 'Tối đa 128 ký tự'),
    expiryDate: yup
        .string()
        .required('Vui lòng ngày hết hạn thẻ')
        .min(5, '5 ký tự, định dạng MM/YY')
        .max(5, '5 ký tự, định dạng MM/YY'),
    cvv: yup
        .string()
        .required('Vui lòng nhập mã cvv')
        .min(3, 'CVV gồm mã 3 số')
        .max(3, 'CVV gồm mã 3 số')
        .matches(/^\d{3}$/, 'Không đúng định dạng'),
    bankName: yup.string().required('Vui lòng nhập tên ngân hàng').max(20, 'Tên ngân hàng tối đa 20 ký tự')
});
