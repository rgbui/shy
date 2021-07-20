
import SparkMD5 from "spark-md5";
var upload_file: HTMLInputElement;
/**
 * 批量选择多个文件
 * @param options 
 * @returns 
 */
export async function OpenMultipleFileDialoug(options?: {
    exts?: string[],
    maxSize?: number
}) {
    return new Promise((resolve: (files: File[]) => void, reject: () => void) => {
        if (typeof upload_file == 'undefined') {
            upload_file = document.body.appendChild(document.createElement('input'));
            upload_file.setAttribute('type', 'file');
        }
        function selectFile(ev: Event) {
            if (upload_file.files.length > 0) {
                resolve(Array.from(upload_file.files))
            }
            else resolve([]);
            upload_file.addEventListener('change', selectFile);
        }
        upload_file.addEventListener('change', selectFile);
        upload_file.click();
    })
}
/**
 * 只选择一个文件上传
 * @param options 
 * @returns 
 */
export async function OpenFileDialoug(options?: {
    exts?: string[],
    maxSize?: number
}) {
    var files = await OpenMultipleFileDialoug(options);
    if (files.length > 0) return files[0]
    else return null;
}
/**
 * 计算当前文件的md5值
 * @param file 
 * @returns 
 */
export function FileMd5(file: File) {
    return new Promise((resolve: (md5: string) => void, reject: (error: ProgressEvent<FileReader>) => void) => {
        var blobSlice = File.prototype.slice || (File.prototype as any)?.mozSlice || (File.prototype as any).webkitSlice,

            chunkSize = 2097152,                             // Read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

        fileReader.onload = function (e) {
            console.log('read chunk nr', currentChunk + 1, 'of', chunks);
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