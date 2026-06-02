use axum::{
    routing::{get, post},
    Router,
    Json,
};
use tauri::{AppHandle, Emitter};
use std::net::SocketAddr;
use serde_json::{json, Value};

async fn play_handler() -> Json<Value> {
    // In a real app we'd trigger an IPC to frontend
    Json(json!({ "status": "playing" }))
}

async fn pause_handler() -> Json<Value> {
    Json(json!({ "status": "paused" }))
}

pub fn start_server(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        let app_router = Router::new()
            .route("/api/play", post(play_handler))
            .route("/api/pause", post(pause_handler))
            .route("/api/status", get(|| async { Json(json!({ "status": "ok" })) }));

        let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
        println!("Remote control server listening on {}", addr);
        
        let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
        axum::serve(listener, app_router).await.unwrap();
    });
}
