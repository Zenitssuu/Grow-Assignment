// Temporary patch: Redefine IconSymbolName to allow custom icon names for MaterialIcons mapping.
// This avoids type errors from SymbolViewProps['name'] which expects only SFSymbol names.

export type IconSymbolName =
  | 'house.fill'
  | 'paperplane.fill'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right'
  | 'bookmark.fill'
  | 'magnifyingglass'
  | 'plus'
  | 'triangle'
  | 'bookmark'
  | 'divider';
