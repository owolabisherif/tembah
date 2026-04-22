import { MatchCardProp } from "@/types/match"


type GroupType = {
    [index: string]: MatchCardProp[]
}

export default function useDataPagination(data: MatchCardProp[], perPage: number): MatchCardProp[][][] {
    let paginatedData = []
    let group: GroupType = {}
    let groupList: MatchCardProp[][] = []

    for (const item of data) {
        if(Object.keys(group).includes(item.date)) {
            group[item.date].push(item)
        } else {
            group[item.date] = [item]
        }
    }

    for(const [key, value] of Object.entries(group)) {
        groupList.push(value)
    }

    if(groupList.length) {
        for (let i = 0; i < groupList.length; i+=perPage) {
            const chunk = groupList.slice(i, i + perPage)
            paginatedData.push(chunk)
        }
    }

    return paginatedData
}