use log::trace;
use template::hello;

fn main() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("trace")).init();
    trace!("main.rs");
    println!("{}", hello("world"));
}
