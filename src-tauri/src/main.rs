#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::generate_handler;

mod login_handler;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg(target_os = "macos")]
mod mac;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        // .plugin(login_handler::init())
        .setup(|app| {
            if cfg!(target_os = "macos") {
                #[cfg(target_os = "macos")]
                use mac::window::setup_mac_window;

                #[cfg(target_os = "macos")]
                setup_mac_window(app);
            }

            Ok(())
        })
        // .invoke_handler(generate_handler![
        //     crate::login_handler::return_chzzk_cookies
        // ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
