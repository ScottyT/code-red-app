export default function (doc) {
  if (doc.type === 'page') {
    return '/' + doc.uid
  }
  if (doc.type === 'reports') {
    return '/reports/' + doc.uid
  }
}
