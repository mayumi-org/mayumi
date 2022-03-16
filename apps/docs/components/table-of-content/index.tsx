import React from 'react'
import { compact } from 'lodash-es'
import { styled } from 'mayumi/theme'
import { Text } from 'mayumi/text'

function useScrollSpy(selectors: string[], options?: IntersectionObserverInit) {
  const [activeId, setActiveId] = React.useState<string>()
  const observer = React.useRef<IntersectionObserver>()
  React.useEffect(() => {
    const elements = selectors.map((selector) => document.querySelector(selector))
    if (observer.current) {
      observer.current.disconnect()
    }
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.getAttribute('id')!)
        }
      })
    }, options)
    elements.forEach((el) => el && observer.current?.observe(el))
    return () => observer.current?.disconnect()
  }, [options, selectors])

  return activeId
}

export interface Heading {
  level: number
  text: string
  id: string
}

const mdxType2num: Record<string, number> = {
  h2: 2,
  h3: 3,
}

function isHeading(child: React.ReactElement) {
  if (child.props?.mdxType) {
    return new Set(['h2', 'h3']).has(child.props.mdxType)
  }
  return false
}

export function getHeadings(children: React.ReactNode): Heading[] {
  return compact(
    React.Children.toArray(children)
      .filter((child) => React.isValidElement(child) && isHeading(child))
      // eslint-disable-next-line array-callback-return
      .map((heading) => {
        if (React.isValidElement(heading)) {
          return {
            level: mdxType2num[heading.props?.mdxType],
            id: heading.props?.children,
            text: heading.props?.children,
          }
        }
      }),
  )
}

const List = styled('ul', {
  p: '$0',
  listStyle: 'none',
  '& li': {
    mr: '$3',
  },
  '& li[data-level=2]': {
    ml: '$0',
  },
  '& li[data-level=3]': {
    ml: '$3',
  },
})

const Nav = styled('nav', {
  position: 'sticky',
  top: '$0',
  right: '$0',
})

interface TableOfContentProps {
  headings: Heading[]
}

export function TableOfContent(props: TableOfContentProps) {
  const { headings } = props
  const activeId = useScrollSpy(
    headings.map(() => `h2,h3`),
    {
      rootMargin: '0% 0% -24% 0%',
    },
  )
  return (
    <Nav data-role="table-of-content">
      <Text h5={true}>On this page</Text>
      <List>
        {headings.map(({ id, text, level }) => (
          <li data-level={level} data-role="list-item" key={id} title={text}>
            <Text
              p={true}
              size="xs"
              type="tertiary"
              css={{
                fontWeight: activeId === id ? '$bold' : '$normal',
              }}
            >
              {text}
            </Text>
          </li>
        ))}
      </List>
    </Nav>
  )
}
