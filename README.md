# Select → Hover → Search

Three steps:

1) **Select** text.

2) **Hover** over a search tool.

3) **Search** instantly.

Bigger goal: Get explanations faster, learn faster.

## Install it in 1 step for free at the Chrome Web Store

https://chrome.google.com/webstore/detail/select-hover-search/aiccnapghjogkbccojfkmmdedeimjjak

## Demo

https://www.youtube.com/watch?v=T7jN49ZUfVU

## Development reminders

In `.bash_profile`:

```sh
alias zipup='zip -r ${PWD##*/}.zip * -x *.zip -x .husky/* -x node_modules/* -x ".github/*" -x .eslintignore -x .eslintrc.js -x .gitignore -x .travis.yml -x CODEOWNERS -x contributing.md; echo; echo "created ${PWD##*/}.zip inside this folder"; echo;'
```
