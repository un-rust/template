use urlogger::{log, LogLevel};

pub fn hello(name: &str) -> String {
    log!(LogLevel::Info, "lib.rs");
    format!("Hello, {}!", name)
}
