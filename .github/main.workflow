workflow "Label Pull Request" {
  on = "push"
  resolves = ["Label Pull Request"]
}

action "Label Pull Request" {
  uses = "Labeler"
}
