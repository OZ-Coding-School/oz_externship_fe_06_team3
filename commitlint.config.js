const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'build', 'test', 'refactor', 'hotfix'],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'], // 제목 필수
    'subject-case': [0],
    'body-empty': [0],
    'body-min-length': [0],
  },
}

export default config