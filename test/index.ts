
import $ from 'jquery';
import * as moment from 'moment';
import * as tpl from './tpl.html';
import * as less from './index.less';
import * as scss from './index.scss';
import * as css from './index.css';
import tsImport from './tsImport';

interface User {
  name: string,
}

let user: User = {
  name: '666',
};

console.log('tsImport', tsImport());
console.log('moment', moment);
console.log('less', JSON.stringify(less), less);
console.log('scss', JSON.stringify(scss), scss);
console.log('css', JSON.stringify(css), css);
console.log('jquery', $);
console.log('moment', moment);
console.log('tpl', tpl);
console.log('user', user);
