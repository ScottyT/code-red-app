import {provide} from '@nuxtjs/composition-api'
import userReports from '@/store/userReports'

export default ({app}, inject) => {
    app.setup = () => {
        provide(userReports, 'reportStore')
    }
    inject('reportStore', userReports)
}