---
title: homebrew 作弊码
date: '2020-03-27'
tags: ['mac']
original: 'https://devhints.io/homebrew'
---

`homebrew` 常用命令集合

### Commands

| Command                    | Description                |
| -------------------------- | -------------------------- |
| `brew install git`         | Install a package          |
| `brew uninstall git`       | Remove/Uninstall a package |
| `brew upgrade git`         | Upgrade a package          |
| ---                        | ---                        |
| `brew unlink git`          | Unlink                     |
| `brew link git`            | Link                       |
| `brew switch git 2.5.0`    | Change versions            |
| ---                        | ---                        |
| `brew list --versions git` | See what versions you have |

### More package commands

| Command            | Description                 |
| ------------------ | --------------------------- |
| `brew info git`    | List versions, caveats, etc |
| `brew cleanup git` | Remove old versions         |
| `brew edit git`    | Edit this formula           |
| `brew cat git`     | Print this formula          |
| `brew home git`    | Open homepage               |
| `brew search git`  | Search for formulas         |

### Global commands

| Command         | Description              |
| --------------- | ------------------------ |
| `brew update`   | Update brew and cask     |
| `brew list`     | List installed           |
| `brew outdated` | What's due for upgrades? |
| `brew doctor`   | Diagnose brew issues     |

### Brew Cask commands

| Command                     | Description                 |
| --------------------------- | --------------------------- |
| `brew cask install firefox` | Install the Firefox browser |
| `brew cask list`            | List installed applications |

Cask commands are used for interacting with graphical applications.

## Reference

- [homebrew FAQ](https://docs.brew.sh/FAQ)
