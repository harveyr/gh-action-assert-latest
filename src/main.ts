import * as core from '@actions/core'
import * as kit from '@harveyr/github-actions-kit'
import * as github from '@actions/github'


async function run(): Promise<void> {
  const context = github.context
  // const currentSha = await kit.getSha()
  const currentBranch = github.context.payload.ref as string
  const {owner, repo} = context.repo

  core.info(`Fetching commits for ${owner}/${repo}:${currentBranch}`)

  const githubToken = kit.getInputSafe('github-token', {required: true})
  const client = new github.GitHub(githubToken)
  const commits = await client.repos.listCommits({
    owner,
    repo,
    sha: currentBranch,
    // TODO: use since
    per_page: 3
  })
  for (const commit of commits) {
    console.log('commit', commit.sha)
  }
  // const latestCommit: string = 'asdf'
  // console.log('Hello cyber')
}

run().catch(err => {
  core.setFailed(`${err}`)
})
