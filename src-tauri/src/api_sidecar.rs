use std::process::Command;
use tauri::AppHandle;

pub fn start_sidecar(_app: AppHandle) {
    std::thread::spawn(|| {
        println!("Starting NeteaseCloudMusicApi sidecar...");
        // Run the locally installed module via node
        let _child = Command::new("node")
            .arg("../server.cjs")
            .env("PORT", "3000")
            .spawn()
            .expect("Failed to start netease-cloud-music-api");
            
        // Keep thread alive
        loop {
            std::thread::sleep(std::time::Duration::from_secs(3600));
        }
    });
}
