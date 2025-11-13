import { store } from "../redux/Store"
import Types from "../redux/Types"
import { updateNotificationBadge } from "../Util/CommonFun"
import appConfig from "../Util/Config"
import { callGetRestApis } from "./Api"

export const getBadgeCountApi = async () => {
    return await callGetRestApis(appConfig().getBadgeCount)
        .then((res) => {
            if (res?.data) {
                const badgeCount = res?.data?.unread_messages + res?.data?.unread_roster_notifications
                updateNotificationBadge(badgeCount ?? 0)
                store.dispatch({ type: Types.SAVE_UNREAD_MSG_COUNT, data: res?.data?.unread_messages })
            }
            console.log('get Badge Count Api Api resp :- ', res)
            return true
        })
        .catch((error) => {
            console.log('get Badge Count Api error :- ', error)
            return true
        })
}