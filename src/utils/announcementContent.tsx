/** ZIP 참고 프로젝트와 동일한 단순 마크다운 라인 렌더링 */
export function renderAnnouncementBody(content: string) {
  const lines = content.trim().split('\n')
  return lines.map((line, index) => {
    if (line.startsWith('## ')) {
      return (
        <h2 key={index} className="ilc-article-h2">
          {line.replace('## ', '')}
        </h2>
      )
    }
    if (line.startsWith('### ')) {
      return (
        <h3 key={index} className="ilc-article-h3">
          {line.replace('### ', '')}
        </h3>
      )
    }
    if (line.startsWith('- ')) {
      return (
        <li key={index} className="ilc-article-li">
          {line.replace('- ', '')}
        </li>
      )
    }
    if (line.trim() === '') {
      return <br key={index} />
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={index} className="ilc-article-p">
          <strong>{line.replace(/\*\*/g, '')}</strong>
        </p>
      )
    }
    if (/^\d+\.\s/.test(line.trim())) {
      return (
        <p key={index} className="ilc-article-p ilc-article-ol-line">
          {line.trim()}
        </p>
      )
    }
    return (
      <p key={index} className="ilc-article-p">
        {line}
      </p>
    )
  })
}
