workflow "New workflow" {
  on = "push"
  resolves = ["First interaction"]
}

action "First interaction" {
  uses = "actions/first-interaction@b01f95e46968766d9daee3f385dd7867626ebe67"
}
