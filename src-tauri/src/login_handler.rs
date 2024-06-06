// use tauri::{
//     plugin::{Builder, TauriPlugin},
//     Manager, Runtime, Window,
// };

// #[tauri::command]
// pub async fn return_chzzk_cookies(window: Window, cookies: String) -> Result<(), String> {
//     window
//         .get_webview_window("main")
//         .unwrap()
//         .emit("chzzk_cookies", cookies);
//     Ok(())
// }

// pub fn init<R: Runtime>() -> TauriPlugin<R> {
//     Builder::new("traffic")
//         .on_navigation(|webview, url| {
//             if webview.label() == "chzzk" && url.domain().unwrap() == "chzzk.naver.com" {
//               webview.eval("__TAURI_INTERNALS__.invoke('return_chzzk_cookies', { cookies: document.cookie })");
//               // webview.window().close();
//             }

//             true
//         })
//         .build()
// }
