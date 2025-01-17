import { findAfter } from 'unist-util-find-after';
import { visitParents } from 'unist-util-visit-parents';

const MAX_HEADING_DEPTH = 6

function plugin () {
  return transform
}

function transform (tree) {
  for (let depth = MAX_HEADING_DEPTH; depth > 0; depth--) {
    visitParents(
      tree,
      node => node.type === 'heading' && node.depth === depth,
      sectionize
    )
  }
}

function sectionize (node, ancestors) {
  const start = node
  const depth = start.depth
  const parent = ancestors[ancestors.length - 1]

  const isEnd = node => node.type === 'heading' && node.depth <= depth || node.type === 'export'
  const end = findAfter(parent, start, isEnd)

  const startIndex = parent.children.indexOf(start)
  const endIndex = parent.children.indexOf(end)

  const between = parent.children.slice(
    startIndex,
    endIndex > 0 ? endIndex : undefined
  )

  const section = {
    type: 'section',
    depth: depth,
    children: between,
    data: {
      hName: 'section'
    }
  }

  parent.children.splice(startIndex, section.children.length, section)
}

export { plugin as sectionize }