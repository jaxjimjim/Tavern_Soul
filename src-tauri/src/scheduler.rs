use std::time::Duration;
use tauri::{AppHandle, Emitter};

pub fn start_scheduler(app: AppHandle) {
    std::thread::spawn(move || {
        loop {
            // Check time every minute
            let now = chrono::Local::now();
            let time_str = now.format("%H:%M").to_string();
            
            // In a real app, read from playlist-schedule.json
            // For now we just emit the time and let frontend handle it
            app.emit("time-tick", time_str.clone()).unwrap();
            
            std::thread::sleep(Duration::from_secs(60));
        }
    });
}
