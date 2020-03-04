import * as core from '@actions/core'
import * as kit from '@harveyr/github-actions-kit'
import * as github from '@actions/github'

async function run(): Promise<void> {
  const context = github.context
  const { owner, repo } = context.repo
  const currentBranch = context.payload.ref as string
  const currentSha: string = kit.getSha()

  core.info(`Fetching commits for ${owner}/${repo}:${currentBranch}`)

  const githubToken = kit.getInputSafe('github-token', { required: true })
  const client = new github.GitHub(githubToken)
  const resp = await client.repos.listCommits({
    owner,
    repo,
    sha: currentBranch,
    per_page: 1,
  })
  if (resp.status !== 200) {
    throw new Error(`Failed to fetch commits [${resp.status}] ${resp.data}`)
  }

  const commits = resp.data
  const latestSha = commits[0].sha

  if (currentSha !== latestSha) {
    core.setFailed(
      `Current SHA ${currentSha.slice(0, 7)} is behind ${latestSha.slice(
        0,
        7,
      )}`,
    )
  } else {
    core.info(`Current SHA ${currentSha.slice(0, 7)} is the latest commit.`)
  }
}

run().catch(err => {
  core.setFailed(`${err}`)
})
