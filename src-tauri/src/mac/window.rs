use tauri::{App, Manager, Runtime, WebviewWindow};

const WINDOW_CONTROL_PAD_X: f64 = 20.0;
const WINDOW_CONTROL_PAD_Y: f64 = 26.0;

pub trait WindowExt {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self);
}

#[cfg(target_os = "macos")]
unsafe fn set_transparent_titlebar(id: cocoa::base::id) {
    use cocoa::appkit::NSWindow;

    id.setTitlebarAppearsTransparent_(cocoa::base::YES);
    id.setTitleVisibility_(cocoa::appkit::NSWindowTitleVisibility::NSWindowTitleHidden);
}

struct UnsafeWindowHandle(*mut std::ffi::c_void);
unsafe impl Send for UnsafeWindowHandle {}
unsafe impl Sync for UnsafeWindowHandle {}

#[cfg(target_os = "macos")]
fn update_window_theme(window: &tauri::WebviewWindow) {
    use cocoa::appkit::{NSAppearance, NSAppearanceNameVibrantDark, NSWindow};

    unsafe {
        let window_handle = UnsafeWindowHandle(window.ns_window().unwrap());

        let _ = window.run_on_main_thread(move || {
            let handle = window_handle;

            NSWindow::setAppearance(
                handle.0 as cocoa::base::id,
                NSAppearance(NSAppearanceNameVibrantDark),
            );
            set_window_controls_pos(
                handle.0 as cocoa::base::id,
                WINDOW_CONTROL_PAD_X,
                WINDOW_CONTROL_PAD_Y,
            );
        });
    }
}

#[cfg(target_os = "macos")]
fn set_window_controls_pos(window: cocoa::base::id, x: f64, y: f64) {
    use cocoa::{
        appkit::{NSView, NSWindow, NSWindowButton},
        foundation::NSRect,
    };

    unsafe {
        let close = window.standardWindowButton_(NSWindowButton::NSWindowCloseButton);
        let miniaturize = window.standardWindowButton_(NSWindowButton::NSWindowMiniaturizeButton);
        let zoom = window.standardWindowButton_(NSWindowButton::NSWindowZoomButton);

        let title_bar_container_view = close.superview().superview();

        let close_rect: NSRect = msg_send![close, frame];
        let button_height = close_rect.size.height;

        let title_bar_frame_height = button_height + y;
        let mut title_bar_rect = NSView::frame(title_bar_container_view);
        title_bar_rect.size.height = title_bar_frame_height;
        title_bar_rect.origin.y = NSView::frame(window).size.height - title_bar_frame_height;
        let _: () = msg_send![title_bar_container_view, setFrame: title_bar_rect];

        let window_buttons = vec![close, miniaturize, zoom];
        let space_between = NSView::frame(miniaturize).origin.x - NSView::frame(close).origin.x;

        for (i, button) in window_buttons.into_iter().enumerate() {
            let mut rect: NSRect = NSView::frame(button);
            rect.origin.x = x + (i as f64 * space_between);
            button.setFrameOrigin(rect.origin);
        }
    }
}

impl<R: Runtime> WindowExt for WebviewWindow<R> {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self) {
        unsafe {
            let id = self.ns_window().unwrap() as cocoa::base::id;
            set_transparent_titlebar(id);
            set_window_controls_pos(id, WINDOW_CONTROL_PAD_X, WINDOW_CONTROL_PAD_Y);
        }
    }
}

#[cfg(target_os = "macos")]
#[derive(Debug)]
struct WindowState {
    window: WebviewWindow,
}

#[cfg(target_os = "macos")]
pub fn setup_mac_window(app: &mut App) {
    use cocoa::appkit::NSWindow;
    use cocoa::base::{id, BOOL};
    use cocoa::foundation::NSUInteger;
    use objc::runtime::{Object, Sel};
    use std::ffi::c_void;
    use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

    fn with_window_state<F: FnOnce(&mut WindowState) -> T, T>(this: &Object, func: F) {
        let ptr = unsafe {
            let x: *mut c_void = *this.get_ivar("app_box");
            &mut *(x as *mut WindowState)
        };
        func(ptr);
    }

    let window = app.get_webview_window("main").unwrap();

    apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
        .expect("apply_vibrancy' is only supported on macOS");

    unsafe {
        let ns_win = window.ns_window().unwrap() as id;
        let current_delegate: id = ns_win.delegate();

        extern "C" fn on_window_should_close(this: &Object, _cmd: Sel, sender: id) -> BOOL {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                msg_send![super_del, windowShouldClose: sender]
            }
        }
        extern "C" fn on_window_will_close(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowWillClose: notification];
            }
        }
        extern "C" fn on_window_did_resize(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                with_window_state(&*this, |state| {
                    let id = state.window.ns_window().unwrap() as id;

                    set_window_controls_pos(id, WINDOW_CONTROL_PAD_X, WINDOW_CONTROL_PAD_Y);
                });

                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowDidResize: notification];
            }
        }
        extern "C" fn on_window_did_move(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowDidMove: notification];
            }
        }
        extern "C" fn on_window_did_change_backing_properties(
            this: &Object,
            _cmd: Sel,
            notification: id,
        ) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowDidChangeBackingProperties: notification];
            }
        }
        extern "C" fn on_window_did_become_key(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowDidBecomeKey: notification];
            }
        }
        extern "C" fn on_window_did_resign_key(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowDidResignKey: notification];
            }
        }
        extern "C" fn on_dragging_entered(this: &Object, _cmd: Sel, notification: id) -> BOOL {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                msg_send![super_del, draggingEntered: notification]
            }
        }
        extern "C" fn on_prepare_for_drag_operation(
            this: &Object,
            _cmd: Sel,
            notification: id,
        ) -> BOOL {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                msg_send![super_del, prepareForDragOperation: notification]
            }
        }
        extern "C" fn on_perform_drag_operation(this: &Object, _cmd: Sel, sender: id) -> BOOL {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                msg_send![super_del, performDragOperation: sender]
            }
        }
        extern "C" fn on_conclude_drag_operation(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, concludeDragOperation: notification];
            }
        }
        extern "C" fn on_dragging_exited(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, draggingExited: notification];
            }
        }
        extern "C" fn on_window_will_use_full_screen_presentation_options(
            this: &Object,
            _cmd: Sel,
            window: id,
            proposed_options: NSUInteger,
        ) -> NSUInteger {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                msg_send![super_del, window: window willUseFullScreenPresentationOptions: proposed_options]
            }
        }
        extern "C" fn on_window_did_enter_full_screen(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                with_window_state(&*this, |state| {
                    state.window.emit("did-enter-fullscreen", ()).unwrap();
                });

                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowDidEnterFullScreen: notification];
            }
        }
        extern "C" fn on_window_will_enter_full_screen(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                with_window_state(&*this, |state| {
                    state.window.emit("will-enter-fullscreen", ()).unwrap();
                });

                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowWillEnterFullScreen: notification];
            }
        }
        extern "C" fn on_window_did_exit_full_screen(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                with_window_state(&*this, |state| {
                    state.window.emit("did-exit-fullscreen", ()).unwrap();

                    let id = state.window.ns_window().unwrap() as id;
                    set_window_controls_pos(id, WINDOW_CONTROL_PAD_X, WINDOW_CONTROL_PAD_Y);
                });

                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowDidExitFullScreen: notification];
            }
        }
        extern "C" fn on_window_will_exit_full_screen(this: &Object, _cmd: Sel, notification: id) {
            unsafe {
                with_window_state(&*this, |state| {
                    state.window.emit("will-exit-fullscreen", ()).unwrap();
                });

                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowWillExitFullScreen: notification];
            }
        }
        extern "C" fn on_window_did_fail_to_enter_full_screen(
            this: &Object,
            _cmd: Sel,
            window: id,
        ) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, windowDidFailToEnterFullScreen: window];
            }
        }
        extern "C" fn on_effective_appearance_did_change(
            this: &Object,
            _cmd: Sel,
            notification: id,
        ) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![super_del, effectiveAppearanceDidChange: notification];
            }
        }
        extern "C" fn on_effective_appearance_did_changed_on_main_thread(
            this: &Object,
            _cmd: Sel,
            notification: id,
        ) {
            unsafe {
                let super_del: id = *this.get_ivar("super_delegate");
                let _: () = msg_send![
                    super_del,
                    effectiveAppearanceDidChangedOnMainThread: notification
                ];
            }
        }

        let app_state = WindowState { window };
        let app_box = Box::into_raw(Box::new(app_state)) as *mut c_void;

        ns_win.setDelegate_(delegate!("MainWindowDelegate", {
      window: id = ns_win,
      app_box: *mut c_void = app_box,
      toolbar: id = cocoa::base::nil,
      super_delegate: id = current_delegate,
      (windowShouldClose:) => on_window_should_close as extern fn(&Object, Sel, id) -> BOOL,
      (windowWillClose:) => on_window_will_close as extern fn(&Object, Sel, id),
      (windowDidResize:) => on_window_did_resize as extern fn(&Object, Sel, id),
      (windowDidMove:) => on_window_did_move as extern fn(&Object, Sel, id),
      (windowDidChangeBackingProperties:) => on_window_did_change_backing_properties as extern fn(&Object, Sel, id),
      (windowDidBecomeKey:) => on_window_did_become_key as extern fn(&Object, Sel, id),
      (windowDidResignKey:) => on_window_did_resign_key as extern fn(&Object, Sel, id),
      (draggingEntered:) => on_dragging_entered as extern fn(&Object, Sel, id) -> BOOL,
      (prepareForDragOperation:) => on_prepare_for_drag_operation as extern fn(&Object, Sel, id) -> BOOL,
      (performDragOperation:) => on_perform_drag_operation as extern fn(&Object, Sel, id) -> BOOL,
      (concludeDragOperation:) => on_conclude_drag_operation as extern fn(&Object, Sel, id),
      (draggingExited:) => on_dragging_exited as extern fn(&Object, Sel, id),
      (window:willUseFullScreenPresentationOptions:) => on_window_will_use_full_screen_presentation_options as extern fn(&Object, Sel, id, NSUInteger) -> NSUInteger,
      (windowDidEnterFullScreen:) => on_window_did_enter_full_screen as extern fn(&Object, Sel, id),
      (windowWillEnterFullScreen:) => on_window_will_enter_full_screen as extern fn(&Object, Sel, id),
      (windowDidExitFullScreen:) => on_window_did_exit_full_screen as extern fn(&Object, Sel, id),
      (windowWillExitFullScreen:) => on_window_will_exit_full_screen as extern fn(&Object, Sel, id),
      (windowDidFailToEnterFullScreen:) => on_window_did_fail_to_enter_full_screen as extern fn(&Object, Sel, id),
      (effectiveAppearanceDidChange:) => on_effective_appearance_did_change as extern fn(&Object, Sel, id),
      (effectiveAppearanceDidChangedOnMainThread:) => on_effective_appearance_did_changed_on_main_thread as extern fn(&Object, Sel, id)
    }))
    }

    let main_window = app.get_webview_window("main").unwrap();
    main_window.set_transparent_titlebar();
    update_window_theme(&main_window);
}