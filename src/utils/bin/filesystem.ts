type FileSystemNode = {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: { [key: string]: FileSystemNode };
  isExecutable?: boolean;
  isProtected?: boolean;
  password?: string;
};

let fileSystem: FileSystemNode = {
  name: '/',
  type: 'directory',
  children: {
    dev: {
      name: 'dev',
      type: 'directory',
      children: {
        stanley: {
          name: 'stanley',
          type: 'directory',
          children: {
            executables: {
              name: 'executables',
              type: 'directory',
              children: {
                'waves.exe': {
                  name: 'waves.exe',
                  type: 'file',
                  isExecutable: true,
                },
                'matrix.exe': {
                  name: 'matrix.exe',
                  type: 'file',
                  isExecutable: true,
                },
                'datamines.exe': {
                  name: 'datamines.exe',
                  type: 'file',
                  isExecutable: true,
                },
              },
            },
            'docs': {
              name: 'docs',
              type: 'directory',
              children: {
                'II-truth.txt': {
                  name: 'II-truth.txt',
                  type: 'file',
                  content: `II. [tɹuθ] Truth
that beckons the lungs into disfunction. he tastes a half-breath, ever quick on the draw,
the swallow stuck in the squeeze of his throat, like
reluctance falling back in on itself.
   she laughs in poems,
     cries in fluttered kisses,
       dances too.
no one but them and the night sky could feel his knees bruise and pop
under the weight of wooden ground she believed existed only to hold him down.
   like a flame consumed.`,
                },
                'enjoy-your-stay.txt': {
                  name: 'enjoy-your-stay.txt',
                  type: 'file',
                  content: `
                  enjoy your stay
                  enjoy your stay
                  enjoy your stay
                  enjoy your stay
                  enjoy your stay
                  enjoy your stay
                  enjoy your stay
                  enjoy your stay
                  enjoy your stay
                  enjoy your stay
                  enjoy your stay
enjoy`,
                },
                'rain-steam-and-speed-JMW-Turner.txt': {
                  name: 'rain-steam-and-speed-JMW-Turner.txt',
                  type: 'file',
                  content:
`softly,
the breath under your lips begins to feel mine
your heart, 
defiant,
tries to break the silence.
it is fast & barely noticeable,
yet it is mine still.

Nowhere to go.

hints of red steam towards it
Forever:
`
                },
                'no-hands.txt': {
                  name: 'no-hands.txt',
                  type: 'file',
                  content: 
`no hands dirtied,
slathered with the sounds, 
all to elicit now -
what felt like you back then
                  `
                }
              },
            },
            'secrets.txt': {
              name: 'secrets.txt',
              type: 'file',
              content: '<span class="text-dark-red">Hi Lyds, <3</span>',
              isProtected: true,
              password: '10/29',
            },
            'name-ascii.txt': {
              name: 'name-ascii.txt',
              type: 'file',
              content: `<img 
                    src="/ascii-art.png" 
                    alt="signature" 
                    style="width: 100%; max-width: 750px; height: auto;"/>`,
            },
            'real-testimonials.txt': {
              name: 'real-testimonials.txt',
              type: 'file',
              content: `
"Definitely a coder" - some
"Dastardly handsome" - others <span style="opacity: 0.7">(mostly my girlfriend)</span>
"This is a guy you want behind the keyboard" - anyone who's heard me play the piano
"He's alright" - my mom
              `,
            },
          },
        },
      },
    },
  },
};

let currentPath: string[] = ['/', 'dev', 'stanley'];

export const getCurrentPath = () => {
  return currentPath.join('/').replace('//', '/');
};

// Helper functions
export const getNodeAtPath = (path: string[]): FileSystemNode | null => {
  let current = fileSystem;

  // Handle root directory case
  if (path.length === 1 && path[0] === '/') return fileSystem;

  // Skip the first empty string from split('/')
  for (let i = 1; i < path.length; i++) {
    if (!current.children || !current.children[path[i]]) return null;
    current = current.children[path[i]];
  }
  return current;
};

export const resolvePath = (targetPath: string): string[] => {
  // Handle absolute paths
  if (targetPath.startsWith('/')) {
    return ['/', ...targetPath.slice(1).split('/').filter(Boolean)];
  }

  // Handle . and ..
  const resolvedPath = [...currentPath];
  const parts = targetPath.split('/').filter(Boolean);

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (resolvedPath.length > 1) resolvedPath.pop();
      continue;
    }
    resolvedPath.push(part);
  }

  return resolvedPath;
};

// Command implementations
export const pwd = async (args: string[]): Promise<string> => {
  return currentPath.join('/').replace('//', '/');
};

export const cd = async (args: string[]): Promise<string> => {
  if (args.length === 0 || args[0] === '~') {
    currentPath = ['/', 'dev', 'stanley'];
    return '';
  }

  const targetPath = resolvePath(args[0]);
  const targetNode = getNodeAtPath(targetPath);

  if (!targetNode) {
    return `cd: no such directory: ${args[0]}`;
  }

  if (targetNode.type !== 'directory') {
    return `cd: not a directory: ${args[0]}`;
  }

  currentPath = targetPath;

  // message output on exe

  if (targetNode.name === 'executables') {
    const message = `\nThere are some fun programs for you to try out! Run one with <span class='text-dark-green'>./[program].exe</span>`;
    const lsOutput = await ls([]);
    return message + '\n\n' + lsOutput;
  }

  return '';
};

export const ls = async (args: string[]): Promise<string> => {
  // Default to current directory if no path specified
  const targetPath = args.length > 0 ? resolvePath(args[0]) : currentPath;
  const node = getNodeAtPath(targetPath);

  if (!node) {
    return `ls: cannot access '${args[0]}': No such file or directory`;
  }

  if (node.type === 'file') {
    return node.name;
  }

  if (!node.children) {
    return '';
  }

  // Format output similar to real ls
  const output: string[] = [];
  const entries = Object.values(node.children);

  // Sort directories first, then files, both alphabetically
  entries.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  entries.forEach((entry) => {
    const name = entry.type === 'directory' ? `${entry.name}/` : entry.name;
    output.push(name);
  });

  return output.join('\n');
};

export const cat = async (args: string[]): Promise<string> => {
  if (args.length === 0) return 'Usage: cat <file>';

  const targetPath = resolvePath(args[0]);
  const node = getNodeAtPath(targetPath);

  if (!node) {
    return `cat: ${args[0]}: No such file or directory`;
  }

  if (node.type === 'directory') {
    return `cat: ${args[0]}: Is a directory`;
  }

  if (node.isProtected) {
    const password = await window.prompt('This file is password protected. Enter password:');
    if (!password || password !== node.password) {
      return 'Error: Incorrect password';
    }
  }

  return node.content || '';
};
export const protect = async (args: string[]): Promise<string> => {
  if (args.length === 0) return 'Usage: protect <file>';

  const targetPath = resolvePath(args[0]);
  const node = getNodeAtPath(targetPath);

  if (!node) {
    return `protect: ${args[0]}: No such file or directory`;
  }

  if (node.type === 'directory') {
    return `protect: ${args[0]}: Is a directory`;
  }

  if (node.isProtected) {
    return `${args[0]} is already protected`;
  }

  const password = await window.prompt('Enter a password to protect the file:');
  if (!password) {
    return 'Operation cancelled';
  }

  node.isProtected = true;
  node.password = password;
  return `${args[0]} is now password protected`;
};

export const unprotect = async (args: string[]): Promise<string> => {
  if (args.length === 0) return 'Usage: unprotect <file>';

  const targetPath = resolvePath(args[0]);
  const node = getNodeAtPath(targetPath);

  if (!node) {
    return `unprotect: ${args[0]}: No such file or directory`;
  }

  if (node.type === 'directory') {
    return `unprotect: ${args[0]}: Is a directory`;
  }

  if (!node.isProtected) {
    return `${args[0]} is not protected`;
  }

  const password = await window.prompt('Enter the current password:');
  if (!password || password !== node.password) {
    return 'Error: Incorrect password';
  }

  node.isProtected = false;
  node.password = undefined;
  return `${args[0]} is no longer protected`;
};

export const tree = async (args: string[]): Promise<string> => {
  const path = args.length > 0 ? resolvePath(args[0]) : currentPath;
  const node = getNodeAtPath(path);

  if (!node) {
    return `tree: '${args[0]}': No such file or directory`;
  }

  if (node.type === 'file') {
    return `tree: '${args[0]}': Not a directory`;
  }

  const buildTree = (
    node: FileSystemNode,
    prefix: string = '',
    isLast: boolean = true,
  ): string => {
    let result = '';

    // Add the current node with proper prefix
    if (prefix) {
      result =
        prefix +
        (isLast ? '└── ' : '├── ') +
        node.name +
        (node.type === 'directory' ? '/' : '') +
        '\n';
    } else {
      // Start with a vertical line for root
      result = ' .' + (node.type === 'directory' ? '' : '') + '\n';
    }

    if (node.type === 'directory' && node.children) {
      const entries = Object.entries(node.children);
      entries.forEach(([_, child], index) => {
        const isLastChild = index === entries.length - 1;
        // Children start with standard indentation
        const newPrefix = prefix ? prefix + (isLast ? '    ' : '│   ') : ' ';
        result += buildTree(child, newPrefix, isLastChild);
      });
    }

    return result;
  };

  const treeOutput = buildTree(node);
  const dirs = treeOutput.match(/\//g)?.length || 0;
  const files = (treeOutput.match(/[^/]\n/g)?.length || 0) - 1; // Subtract 1 for the root line

  return `${treeOutput}\n${dirs} directories, ${files} files`;
};
