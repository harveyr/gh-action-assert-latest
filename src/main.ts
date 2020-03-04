import * as core from '@actions/core'
import * as kit from '@harveyr/github-actions-kit'
import * as github from '@actions/github'


async function run(): Promise<void> {
  const context = github.context
  const currentSha = await kit.getSha()
  const currentBranch = github.context.payload.ref as string
  const {owner, repo} = context.repo

  core.info(`Fetching commits for ${owner}/${repo}:${currentBranch}`)

  const githubToken = kit.getInputSafe('github-token', {required: true})
  const client = new github.GitHub(githubToken)
  const resp = await client.repos.listCommits({
    owner,
    repo,
    sha: currentBranch,
    // TODO: use since
    per_page: 3
  })
  const commits = resp.data
  for (const commit of commits) {
    console.log('commit', commit.sha)
  }
  // const latestCommit: string = 'asdf'
  // console.log('Hello cyber')

  const latestSha = commits[0].sha

  if (currentSha !== latestSha) {
    core.setFailed(`Current SHA ${currentSha.slice(0, 7)} is behind ${latestSha.slice(0.7)}`)
  } else {
    core.info(`Current SHA ${currentSha.slice(0, 7)} is the latest commit.`)
  }
}

run().catch(err => {
  core.setFailed(`${err}`)
})
