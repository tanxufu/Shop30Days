import { useState, useEffect } from 'react';

const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const userInfoLocal = localStorage.getItem('userInfo');

        if (userInfoLocal) {
            setUserInfo(JSON.parse(userInfoLocal));
        }
    }, []);

    return userInfo;
};

export default useUserInfo;
