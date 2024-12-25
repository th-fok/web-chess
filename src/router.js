import { createRouter, createWebHistory } from 'vue-router';
import SignUp from './components/SignUp.vue';
import LogIn from './components/LogIn.vue';
import Main from './components/Main.vue';
import Online from './components/Online.vue';

import Bot from './components/Game.vue';
import Settings from './components/Settings.vue';
import Profile from './components/Profile.vue';

const routes = [
  { path: '/play/online', name: 'Online', component: Online },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/login', name: 'LogIn', component: LogIn },  
  { path: '', name: 'Main', component: Main },

  { path: '/play/computer', name: 'Bot', component: Bot },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/profile', name: 'Profile', component: Profile },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;