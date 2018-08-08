import Vue from 'vue';
import sweetRouter from './router';
import sweetStore from './store';
import SWXHR from './xhr';
import SWTOOL from './tool';
import sweetCountly from './countly';
import ElementUI from 'element-ui';

Vue.use(ElementUI);
Vue.use(SWTOOL);

export { Vue };
export { sweetRouter };
export { sweetStore };
export { SWXHR };
export { sweetCountly };