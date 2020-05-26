import jwtDecode from 'jwt-decode';
import {
    getCookie
} from './func';

const getJwt = () => {
    const entrance = getCookie('entrance');
    const jwt = getCookie(`_entry_${entrance}_sid`);
    return jwt;
};

const testJwt = 'eyJhbGciOiJIUzUxMiJ9.eyJkYXRhIjp7InBob25lIjoiMTgxMjIxODA5NjQifSwiZXhwIjoxNTkyNzU2MDY0LCJzdWIiOiIifQ.Z7sSZC0Yw9o0xc_V7QNQWzbDQFhsjyoPWEPUD46BcaTmtydaIiNalTYIau8OO5LTxCdvy2wujMzAz_gX4g9nTw';


// const jwt = process.env.NODE_ENV === 'production' ? getJwt() : testJwt;
const jwt = testJwt;
let userInfo = {};

try {
    userInfo = jwtDecode(jwt).userInfo;
} catch (e) {
    console.log('jwt', e);
    userInfo = {};
}

export {
    jwt,
    userInfo
};