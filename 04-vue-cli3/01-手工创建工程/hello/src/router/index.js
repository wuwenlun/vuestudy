import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from '../components/Home.vue'
// import About from '../components/About.vue'
// import User from '../components/User.vue'

// 懒加载
const Home = () => import('../components/Home.vue')
const About = () => import('../components/About.vue')
const User = () => import('../components/User.vue')
const News = () => import('../components/HomeComponents/News.vue')
const Notices = () => import('../components/HomeComponents/Notices.vue')
const Profile = () => import('../components/Profile.vue')

Vue.use(VueRouter)

const routes = [
    {
        path:"",
        redirect:"/home"
    },
    {
        path:"/home",
        component:Home,
        meta:{title:"首页"},
        children:[
            {
                path: '',
                redirect:"news"
            },
            {
                path: 'news',
                component: News,
                meta:{title:"新闻"}
            },
            {
                path: 'notices',
                component: Notices,
                meta:{title:"通知"}
            }
        ]
    },
    {
        path:"/about",
        component:About,
        meta:{title:"关于"}
    },
    {
        path:"/user/:userId",
        component:User,
        meta:{title:"用户"}
    },
    {
        path:"/profile",
        component:Profile,
        meta:{title:"档案"}
    }
]

const router = new VueRouter({
    routes,
    mode:"hash"
})
router.beforeEach((to, from, next) => {
    if(to.matched && to.matched.length>0)
        document.title = to.matched[0].meta.title
    next();
})
export default router
