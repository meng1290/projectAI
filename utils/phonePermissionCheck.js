
import permission from "@/js_sdk/wa-permission/permission.js";

//手机权限，图册
export function permissionCheck(){
    return new Promise(async (resolve,reject)=>{
        if(uni.getSystemInfoSync().platform === 'ios'){
            // const camera = permission.judgeIosPermission("camera");//判断ios是否给予摄像头权限
            //ios相册没权限，系统会自动弹出授权框
            let photoLibrary = permission.judgeIosPermission("photoLibrary");//判断ios是否给予相册权限
            if(photoLibrary){
                resolve();
            }else{
                reject('需要开启相册使用权限');
            }
        }else{
            // let camera = await permission.requestAndroidPermission("android.permission.CAMERA");//判断安卓是否给予摄像头权限
            let photoLibrary = await permission.requestAndroidPermission("android.permission.WRITE_EXTERNAL_STORAGE");//判断安卓是否给予相册权限
            if(photoLibrary == -1){
                reject('开启相册的使用权限');
            }else{
                resolve();
            }
        }
    })
}
//跳转到手机开启权限的界面
export function phonePermissionSetting(){
    permission.gotoAppPermissionSetting();
}

//手机权限，摄像头和图册
export function permissionCheck2(){
    return new Promise(async (resolve,reject)=>{
        if(uni.getSystemInfoSync().platform === 'ios'){
            const camera = permission.judgeIosPermission("camera");//判断ios是否给予摄像头权限
            //ios相册没权限，系统会自动弹出授权框
            // let photoLibrary = permission.judgeIosPermission("photoLibrary");//判断ios是否给予相册权限
            if(camera){
                resolve();
            }else{
                reject('需要开启相机使用权限');
            }
        }else{
            let camera = await permission.requestAndroidPermission("android.permission.CAMERA");//判断安卓是否给予摄像头权限
            let photoLibrary = await permission.requestAndroidPermission("android.permission.WRITE_EXTERNAL_STORAGE");//判断安卓是否给予相册权限
            if(camera == -1 || photoLibrary == -1){
                reject('请同时开启相机和相册的使用权限');
            }else{
                resolve();
            }
        }
    })
}