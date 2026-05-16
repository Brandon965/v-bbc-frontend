export const compareImages = (images: any) => {
    const list: any[] = []

    console.log(images)

    for (const data of images) {
        console.log(data)
        if (!data.name) continue
        for (const entry of data.data) {
            const vol = Number(entry.volume) - 1;
            if (!list[vol]) list[vol] = [];
            if (!list[vol][0]) { list[vol][0] = entry }
            else {
                const sizeW = Number(list[vol][0].size.split('*')[0])
                const sizeH = Number(list[vol][0].size.split('*')[1])
                const dSizeW = Number(entry.size.split('*')[0])
                const dSizeH = Number(entry.size.split('*')[1])
                const isSmaller = dSizeH < sizeH && dSizeW < sizeW
                if (isSmaller) {
                    list[vol].push(entry)
                } else {
                    list[vol].push(list[vol][0])
                    list[vol][0] = entry
                };
            }
        }
    }

    return list
}