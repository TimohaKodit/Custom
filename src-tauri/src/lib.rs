mod claude;
mod system;

pub fn run() {
    tauri::Builder::default()
        .manage(system::Monitor::new())
        .invoke_handler(tauri::generate_handler![system::get_system_stats])
        .run(tauri::generate_context!())
        .expect("не удалось запустить приложение");
}
