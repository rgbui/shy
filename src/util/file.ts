
import axios from "axios";
import SparkMD5 from "spark-md5";
/**
 * 计算当前文件的md5值
 * @param file 
 * @returns 
 */
export function FileMd5(file: File) {
    return new Promise((resolve: (md5: string) => void, reject: (error: ProgressEvent<FileReader>) => void) => {
        var blobSlice = File.prototype.slice || (File.prototype as any)?.mozSlice || (File.prototype as any).webkitSlice,

            chunkSize = 2097152 * 10*2,                             // Read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();
        fileReader.onload = function (e) {
            // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
            spark.append(e.target.result);                   // Append array buffer
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            } else {
                resolve(spark.end())
                // console.log('finished loading');
                // console.info('computed hash', spark.end());  // Compute hash
            }
        };

        fileReader.onerror = function (err) {
            reject(err)
            console.warn('oops, something went wrong.');
        };

        function loadNext() {
            var start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        loadNext();
    })
}

export async function XhrReadFileBlob(url: string): Promise<Blob> {
    if (url.startsWith('http://localhost'))
        url = url.replace('http://localhost', 'http://127.0.0.1')
    var r = await axios.get(url, {
        responseType: 'blob'
    });
    return r.data as any;
}