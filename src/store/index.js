import sidebarStore from './sidebar'
import tagsStore from './tags'
import userStore from './user'

export default function useStore() {
    return {
        sidebarStore: sidebarStore(),
        tagsStore: tagsStore(),
        userStore: userStore(),
    }
}
