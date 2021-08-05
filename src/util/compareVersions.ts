export default function compareVersion(version1, version2) {
  const arr1 = version1.split('.')
  const arr2 = version2.split('.')

  const len = Math.max(arr1.length, arr2.length)
  for (let i = 0; i < len; i++) {
    let data1 = 0
    let data2 = 0
    if (i < arr1.length) {
      data1 = parseInt(arr1[i], 10)
    }
    if (i < arr2.length) {
      data2 = parseInt(arr2[i], 10)
    }

    if (data1 < data2) {
      return -1
    } else if (data1 > data2) {
      return 1
    }
  }
  return 0
}
