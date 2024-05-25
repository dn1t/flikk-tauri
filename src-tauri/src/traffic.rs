use objc::msg_send;
use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime, Window,
};

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("traffic")
        .on_window_ready(|window| {
            #[cfg(target_os = "macos")]
            set_transparent_titlebar(window);
            return;
        })
        .build()
}

#[cfg(target_os = "macos")]
fn set_transparent_titlebar<R: Runtime>(window: Window<R>) {
    use cocoa::appkit::{NSWindow, NSWindowTitleVisibility};

    unsafe {
        let id = window.ns_window().unwrap() as cocoa::base::id;

        id.setTitlebarAppearsTransparent_(cocoa::base::YES);
        id.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
        id.setToolbar_(msg_send![class!(NSToolbar), new]);
    }
}
