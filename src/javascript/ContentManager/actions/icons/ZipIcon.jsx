import React from 'react';

import {pure} from 'recompose';
import {SvgIcon} from '@material-ui/core';

let ZipIcon = () => (
    <SvgIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.77099 17.3408H7.07177L8.7539 14.8848V14.4453H5.99267V15.1069H7.69677L6.00244 17.5483V18H8.77099V17.3408Z" fill="black"/>
        <path d="M9.47021 18H10.3247V14.4453H9.47021V18Z" fill="black"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M12.0273 16.7939V18H11.1704V14.4453H12.5889C12.8607 14.4453 13.1007 14.4958 13.3091 14.5967C13.519 14.696 13.681 14.8384 13.7949 15.0239C13.9105 15.2078 13.9683 15.417 13.9683 15.6514C13.9683 15.998 13.8437 16.2756 13.5947 16.4839C13.3473 16.6906 13.0072 16.7939 12.5742 16.7939H12.0273ZM12.0273 16.1323H12.5889C12.7549 16.1323 12.881 16.0908 12.9673 16.0078C13.0552 15.9248 13.0991 15.8076 13.0991 15.6563C13.0991 15.4902 13.0544 15.3576 12.9648 15.2583C12.8753 15.159 12.7533 15.1086 12.5986 15.1069H12.0273V16.1323Z" fill="black"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M6 6.03708L6.846 5.20153L8.4 6.73042L8.4 2H7C5.9 2 5.01 2.9 5.01 4L5.005 12H4C3.44771 12 3 12.4477 3 13V19C3 19.5523 3.44771 20 4 20L5 20C5 21.1 5.89 22 6.99 22H19C20.1 22 21 21.1 21 20V8L15 2H9.6V6.73042L11.154 5.20153L12 6.03708L9 9.00005L6 6.03708ZM14 9V3.5L19.5 9H14ZM4 13H16V19H4V13Z" fill="black"/>
    </SvgIcon>
);

ZipIcon.displayName = 'ZipIcon';
ZipIcon = pure(ZipIcon);
ZipIcon.muiName = 'SvgIcon';

export default ZipIcon;