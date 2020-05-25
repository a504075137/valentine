
import {
    jwt
} from '../jwt';

let pro = '//custom.k8s.acgxpro.com';
let dev = '//120.77.96.19:3010';

pro = dev;
// dev = pro;
const host = process.env.NODE_ENV === 'production' ? pro : dev;

const defaultHeaders = {
    'Content-Type': 'application/json'
};

const authHeader = {
    Authorization: `Bear ${jwt}`
};

// 超时时间
const timeout = 5000;

// 加密秘钥
const encryptSecret = '';

export default {
    host,
    defaultHeaders,
    authHeader,
    timeout,
    encryptSecret
};