export const parse = (text: string) => {
  const list: any = {};
  let block: any = {},
    id = '',
    type = '',
    hotkey = '';

  const lines = text.split('\n');
  const pattern = /^(\w+)=(.+)$/; // skips comments

  // ensures empty line at end of file so final command block is saved
  lines.push('');

  for (const [i, line] of lines.entries()) {
    // adds command block to object whenever new command block is found
    // or at end of file (for the last command block)
    if (lines.length == i + 1 || line.match(/^\[(\w+)\]$/)) {
      if (id != '') {
        id = id.toLowerCase();

        // if a command has multiple blocks, only first is used
        // (same behavior as game)
        if (list[id] == undefined) {
          list[id] = block;
        } else {
          console.warn(`Duplicate: ${id}`);
        }

        block = {};
      }

      id = line.slice(1, -1);
    }

    // matches type=hotkey pairs
    if (line.match(pattern)) {
      type = line.replace(pattern, '$1');
      hotkey = line.replace(pattern, '$2');

      block[type] = hotkey;
    }
  }

  return list;
};
