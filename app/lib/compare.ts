export const compareImages = (images: any) => {
  const list: any[] = [];

  for (const data of images) {
    if (!data.name) continue;
    for (const entry of data.data) {
      const vol = Number(entry.volume) - 1;

      const tempSizeW = Number(entry.size.split("*")[0]);
      const tempSizeH = Number(entry.size.split("*")[1]);
      const aspect = Math.floor((tempSizeW / tempSizeH) * 100) / 100;
      entry.source = data.name;
      
      if (tempSizeH > 4000 && aspect >= 0.73 && aspect < 0.8) {
        const absoluteCropAmount = Math.abs(-355);
        const croppedWidth = tempSizeW - absoluteCropAmount;
        entry.link = `https://wsrv.nl?url=${entry.link}&cx=${absoluteCropAmount}`;
        entry.size = `${croppedWidth}*${tempSizeH}`;
        entry.cropped = true;
      } else if (
        tempSizeW > 2000 &&
        tempSizeH > 2000 &&
        aspect >= 0.73 &&
        aspect < 0.8
      ) {
        const absoluteCropAmount = Math.abs(-211);
        entry.link = `https://wsrv.nl?url=${entry.link}&cx=${absoluteCropAmount}`;
        entry.cropped = true;
      } else if (tempSizeW >= 880 && tempSizeW <= 964 && tempSizeH === 1200) {
        const absoluteCropAmount = Math.abs(120);
        const croppedWidth = tempSizeW - absoluteCropAmount;
        entry.link = `https://wsrv.nl?url=${entry.link}&cw=${croppedWidth}`;
        entry.size = `${croppedWidth}*${tempSizeH}`;
        entry.cropped = true;
      }

      if (!list[vol]) list[vol] = [];
      if (!list[vol][0]) {
        list[vol][0] = entry;
      } else {
        const eSizeW = Number(entry.size.split("*")[0]);
        const eSizeH = Number(entry.size.split("*")[1]);
        const sizeW = Number(list[vol][0].size.split("*")[0]);
        const sizeH = Number(list[vol][0].size.split("*")[1]);
        const isSmaller = eSizeH < sizeH && eSizeW < sizeW;

        if (isSmaller) {
          list[vol].push(entry);
        } else {
          list[vol].push(list[vol][0]);
          list[vol][0] = entry;
        }
      }
    }
  }

  return list;
};
