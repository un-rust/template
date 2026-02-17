# template

<!-- automdrs:badges showCrateVersion="true" showCrateDownloads="true" showCrateDocs="true" showCommitActivity="true" showRepoStars="true" -->
![Crates.io Version](https://img.shields.io/crates/v/template)
![Crates.io Total Downloads](https://img.shields.io/crates/d/template)
![docs.rs](https://img.shields.io/docsrs/template)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/un-rust/template)
![GitHub Repo stars](https://img.shields.io/github/stars/un-rust/template)
<!-- /automdrs -->

Keep your README.md in sync with Cargo.toml—badges, contributors, install snippets—via HTML comment blocks.

**[Full documentation →](https://betterhyq.github.io/automd-rs/)**

## Quick start

```sh
cargo add automd-rs    # as dependency
# or
cargo install automd-rs   # as CLI
```

```bash
automd-rs   # run in crate root
```

Add blocks in README.md, e.g.:

```markdown
<!-- automdrs:badges version downloads docs -->
![Crates.io Version](https://img.shields.io/crates/v/template)
![Crates.io Total Downloads](https://img.shields.io/crates/d/template)
![docs.rs](https://img.shields.io/docsrs/template)
<!-- /automdrs -->
```

Requires `repository = "https://github.com/owner/repo"` in Cargo.toml.

## Block types

| Block | Purpose |
|-------|---------|
| `badges` | Crates.io version, downloads, docs.rs, GitHub stats |
| `contributors` | License + contrib.rocks image |
| `with-automdrs` | Footer line |
| `cargo-add` / `cargo-install` | Add/install snippet |

See [Block Reference](https://betterhyq.github.io/automd-rs/guide/block-reference) for options.

## Library

```rust
use automd_rs::run;
run(Path::new("."), Path::new("README.md"))?;
```

Extend via `BlockHandler` trait. See [API Reference](https://betterhyq.github.io/automd-rs/guide/api).

## License

<!-- automdrs:contributors author="UnRUST" license="Apache-2.0" -->
Published under the [Apache-2.0](./LICENSE) license.
Made by [@UnRUST](https://github.com/un-rust) 💛
<br><br>
<a href="https://github.com/un-rust/template/graphs/contributors">
<img src="https://contrib.rocks/image?repo=un-rust/template" />
</a>
<!-- /automdrs -->

<!-- automdrs:with-automdrs -->

---

_🛠️ auto updated with [automd-rs](https://github.com/betterhyq/automd-rs)_

<!-- /automdrs -->