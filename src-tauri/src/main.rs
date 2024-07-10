// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::fs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn convert_image(path: &str, path_prefix: &str, file_type: &str) {
    println!("path to webp is {}", path);
    println!("path prefix is {path_prefix}");
    let img = image::open(path).unwrap();

    let new_path = path_prefix.to_owned() + file_type;
    img.save(new_path).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![convert_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
