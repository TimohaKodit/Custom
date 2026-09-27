mod claude;
mod disk;
mod system;

pub fn run() {
    tauri::Builder::default()
        .manage(system::Monitor::new())
        .invoke_handler(tauri::generate_handler![
            system::get_system_stats,
            claude::get_claude_stats,
            disk::get_disk_report,
            disk::clean_targets
        ])
        .run(tauri::generate_context!())
        .expect("не удалось запустить приложение");
}
