import { AdSlot } from './AdSlot'

type Props = {
  content: string
  className?: string
}

function splitAtParagraph(html: string, after: number): [string, string] {
  let count = 0
  let idx = 0
  while (count < after) {
    const next = html.indexOf('</p>', idx)
    if (next === -1) return [html, '']
    idx = next + 4
    count++
  }
  return [html.slice(0, idx), html.slice(idx)]
}

export async function ArticleWithAds({ content, className }: Props) {
  const [part1, rest1] = splitAtParagraph(content, 3)
  const [part2, part3] = splitAtParagraph(rest1, 3)

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: part1 }} />

      {rest1 && (
        <AdSlot
          position="IN_CONTENT_1"
          label
          className="my-8 not-prose"
        />
      )}

      {part2 && <div dangerouslySetInnerHTML={{ __html: part2 }} />}

      {part3 && (
        <>
          <AdSlot
            position="IN_CONTENT_2"
            label
            className="my-8 not-prose"
          />
          <div dangerouslySetInnerHTML={{ __html: part3 }} />
        </>
      )}
    </div>
  )
}
