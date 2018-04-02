import { deburr, join, kebabCase, lowerCase, words } from 'lodash'

export default (string) => {
  return kebabCase(join(words(lowerCase(deburr(string))), '-'))
}
