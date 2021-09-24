const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

const getStoryIdFromBranch = (ref) => {
  let id = null;
  if (ref) {
    const chPatternMatch = ref.match(/sc[0-9]{1,}/);
    if (chPatternMatch) {
      const idMatch = chPatternMatch[0].match(/[0-9]{1,}/);
      id = idMatch ? idMatch[0] : null;
    }
  }
  return id;
};

const getClubhouseStory = (storyId, token) => {
  return fetch(
    `https://api.clubhouse.io/api/v3/stories/${storyId}?token=${token}`,
    { method: "GET", redirect: "follow" }
  )
    .then((result) => result.json())
    .catch((error) => error);
};

const sanitizeBody = (body, url, title, description) => {
  const descriptionHeader = core.getInput("descriptionHeader");
  const descriptionBody = description;

  const urlHeader = core.getInput("urlHeader");
  const urlBody = title && url && `[${title}](${url})`;

  const delimiter = core.getInput("delimiter");
  const bodyParts = body.split(delimiter);

  const newBody = bodyParts.map((part) => {
    if (part.includes(descriptionHeader)) {
      return `${descriptionHeader}\n${descriptionBody}\n`;
    }
    if (part.includes(urlHeader)) {
      return `${urlHeader}\n${urlBody}\n`;
    } else {
      return part;
    }
  });
  return newBody.join(`${delimiter}\n`);
};

const updatePR = async (url, title, description) => {
  const github_token = core.getInput("GITHUB_TOKEN", { required: true });
  // Generate the request
  const request = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
  };
  const body = github.context.payload.pull_request.body;
  request.body = sanitizeBody(body, url, title, description);

  // Update the PR
  const client = new github.getOctokit(github_token);
  const response = await client.pulls.update(request);
  core.info(`response: ${response.status}`);
  console.log("PR was successfully updated");
};

const run = async () => {
  try {
    const clubhouse_token = core.getInput("CLUBHOUSE_TOKEN");
    const storyId = await getStoryIdFromBranch(
      github.context.payload.pull_request.head.ref
    );
    const story = storyId
      ? await getClubhouseStory(storyId, clubhouse_token)
      : null;

    if (story) {
      await updatePR(story.app_url, story.name, story.description);
    } else {
      console.log("PR was not updated");
      console.log("Parsed story ID: ", storyId)
      console.log("Clubhouse error: ", story)
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
