export function getCodeDepartement(codeCommune) {
  return codeCommune.slice(0, 2) <= '95' ? codeCommune.slice(0, 2) : codeCommune.slice(0, 3)
}
