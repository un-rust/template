use log::trace;

pub fn hello(name: &str) -> String {
    trace!("lib.rs");
    format!("Hello, {}!", name)
}
