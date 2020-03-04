import * as core from '@actions/core'
import * as kit from '@harveyr/github-actions-kit'
import * as github from '@actions/github'


async function run(): Promise<void> {
  const context = github.context
  const currentSha = await kit.getSha()


  console.log('github.context', JSON.stringify(github.context, null, 2))
  // const latestCommit: string = 'asdf'
  // console.log('Hello cyber')
}

run().catch(err => {
  core.setFailed(`${err}`)
})
