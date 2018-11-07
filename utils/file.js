/**
 * 将文件切片后上传
 * 使用切片名称上传，每一个都做为独立文件。后续获取文件时需要后台合成文件后再返回给前台。
 * @param fileId 文件对象ID
 * @returns {boolean} 返回全部上传结果：true成功/false失败
 */
function uploadFileSlicing(fileId) {
    // 每个文件切片大小定为1MB .
    var bytesPerPiece = 1024 * 1024;
    //文件切片总数
    var totalPieces;
    //上传成功计数器
    var totalFinish=0;

    //获取文件对象
    var blob = document.getElementById(fileId).files[0];
    //切片开始字节数
    var start = 0;
    //切片结束字节数
    var end;
    //切片名称游标
    var index = 0;
    //文件字节数
    var fileSize = blob.size;
    //文件名称
    var fileName = blob.name;

    //计算文件切片总数
    totalPieces = Math.ceil(fileSize / bytesPerPiece);
    //循环处理
    while(start < fileSize) {
        //计算切片结束字节数
        end = start + bytesPerPiece;
        //如果切片结束字节数>文件字节数
        if(end > fileSize) {
            //设置切片结束字节数为文件字节数
            end = fileSize;
        }

        //切片文件对象
        var chunk = blob.slice(start,end);
        //切片文件名称
        var sliceIndex= fileName + index;
        //切片文件数据对象
        var formData = new FormData();

        //使用原文件名称，需要后端实现切片合成功能
        // formData.append("file", chunk, filename);
        //使用切片名称上传，每一个都做为独立文件。后续获取文件时需要后台合成文件后再返回给前台。
        formData.append("file", chunk, sliceIndex);

        //发送上传请求
        $.ajax({
            url: 'https://localhost:9999/file/upload',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
        }).done(function(res){
            //上传成功后，上传成功计数器+1
            totalFinish++;
        }).fail(function(res) {
            //上传失败。
            console.log(res);
        });
        // 设置切片开始字节数为当前循环切片结束字节数
        start = end;
        //切片名称游标+1
        index++;
    }

    //上传成功计数器=文件切片总数
    if(totalFinish===totalPieces){
        //成功
        return true;
    }else{
        //失败
        return false;
    }
}
