import type { CompareData, DownloadResponse } from "~/types/main";
import BL from '~/assets/bl.svg?inline'
import BW from '~/assets/bw.svg?inline'
import BWG from '~/assets/bw-g.svg?inline'
import EBJ from '~/assets/ebj.svg?inline'
import AZ from '~/assets/az.svg?inline'
import MD from '~/assets/md.svg?inline'

export const copyLinks = async (selected: any[], compareData: CompareData) => {
  const links = selected
    .map((value, index) => {
      if (value === undefined) return null
      const item = compareData[index]?.[0]
      return item?.link ?? null
    })
    .filter((link): link is string => link !== null)
    .join('\n')

  if (!links) return false

  try {
    await navigator.clipboard.writeText(links)
    return true
  } catch (error) {
    console.error('Failed to copy links:', error)
    return false
  }
};

export const download = async (selected: any[], compareData: CompareData) => {
    const links = selected
        .map((value, index) => value != undefined ? compareData[index]?.[0].link : null)
        .filter(Boolean)
        .join('&')

    if (!links) return
    
    const { data } = await useFetch<DownloadResponse>('/api/download', { 
        lazy: true, 
        query: { data: links } 
    })

    if (!data.value?.download) return
    
    const byteArray = Uint8Array.from(atob(data.value.download), c => c.charCodeAt(0))
    const blob = new Blob([byteArray], { type: 'application/zip' })

    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: 'images.zip' })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

export const moduleIcon = {
    'Booklive': BL,
    'Bookwalker': BW,
    'Bookwalker Preview': BW,
    'Bookwalker Global': BWG,
    'EBookJapan': EBJ,
    'Amazon': AZ,
    'Amazon Japan': AZ,
    'Mangadex': MD
}