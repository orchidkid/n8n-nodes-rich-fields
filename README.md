# Rich Fields (n8n Community Node)

Create complex JSON structures (nested objects and arrays) in n8n via UI. The node builds a JSON object with nested objects/arrays up to 10 levels deep, with proper typing (string/number/boolean/object/array).

## Features

- Nested objects and arrays (up to 10 levels).
- Value types:
  - String
  - Number
  - Boolean
  - Object
  - Array
- Outputs a ready JSON object

## Installation

### Install via Community Nodes (recommended)
1) In n8n, go to **Settings → Community Nodes → Install**.  
2) Enter the package name: **`n8n-nodes-rich-fields`**.  
3) Confirm.

NPM package: https://www.npmjs.com/package/n8n-nodes-rich-fields

### Install manually
`npm install n8n-nodes-rich-fields` in your `.n8n/nodes` directory, then restart n8n.

### Build the structure
2. Add “Rich Fields” to your workflow.
3. Build the structure:
   - String/Number: set Name + Value.
   - Boolean: set Name + Value (true/false).
   - Object: add nested “Object Fields”.
   - Array: add “Array Items”.
4. Run the node; the assembled object is in `item.json`.

## Limits

- Max nesting depth: 10 levels (to keep UI and recursion safe)

## License

MIT.
