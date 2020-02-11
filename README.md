# Clubhouse PR Updater

This action uses the pr branch name following the naming pattern provided by clubhouse ie: douglasQuaid/ch13234/find-ice-on-mars, and fetches the `name`, the `description` and the `url` of the clubhouse story and adds the information to the PR after opening, syncing or pushing.

The PR template must have a `descriptionHeader`, and a `urlHeader` that matches the default pull request template, and each header must be divided by a unique delimiter. By default this `delimiter` is `___` (creates a long line across the screen in markdown)

## Inputs

### `descriptionHeader`

**Required** Specific title to search for in the body of the existing pull request. This text will be replaced with the description of the clubhouse story.

### `urlHeader`

**Required** Specific url header to search for in the body of the existing pull request. This text will be replaced with the url and title of the clubhouse story.

### `delimiter`

**Required** Delimeter before and after both the description and the url that the body will be split on.

### `GITHUB_TOKEN`

**Required** Github token

### `CLUBHOUSE_TOKEN`

**Required** Clubhouse token

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### _No outputs available for this action_

## Example usage

```
on:
  pull_request:
    branches:
      - master
jobs:
  updatePrWithClubhouseDetails:
    runs-on: ubuntu-latest
    name: Add Clubhouse Info to PR
    steps:
      - name: Update PR
        uses: blakeworsley/action-test@v4.0.19
        with:
          descriptionHeader: '### What does this pull request do?'
          urlHeader: '### What is the relevant story?'
          delimiter: '___'
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CLUBHOUSE_TOKEN: ${{ secrets.CLUBHOUSE_TOKEN }}
```

Example Pull request template in project associated with above `descriptionHeader` and `urlHeader`

```
### Developer notes
-
___
### What does this pull request do?
- *Section will be prefilled by using clubhouse branch syntax ie: `douglasQuaid/ch10384/get-to-mars`*
___
### What is the relevant story?
- *[Section will be prefilled by using clubhouse branch syntax ie: `douglasQuaid/ch10384/get-to-mars`](https://en.wikipedia.org/wiki/Total_Recall_(1990_film))*
___
### How do you feel?
![](LINK_TO_GIPHY_IMAGE_HERE)
```
