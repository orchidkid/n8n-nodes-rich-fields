# Rich Fields (n8n Community Node)

Create complex JSON structures (nested objects and arrays) in n8n via UI—no expressions needed. The node builds a JSON object with nested objects/arrays up to 10 levels deep, with proper typing (string/number/boolean/object/array).

## Features

- Nested objects and arrays (up to 10 levels).
- Value types:
  - String, Number (`Value` field)
  - Boolean (`Value` dropdown true/false)
  - Object (inner “Object Fields”)
  - Array (inner “Array Items”)
- UI-only workflow: build everything with “Add Field” / “Add Item” buttons.
- Outputs a ready JSON object in `item.json`.

## Example

Configuration:
- Add Field → Type: Object, Name: `user`
  - Object Fields → Add Field → Type: String, Name: `name`, Value: `Alice`
  - Object Fields → Add Field → Type: Number, Name: `age`, Value: `30`
  - Object Fields → Add Field → Type: Array, Name: `tags`
    - Array Items → Add Item → Type: String, Value: `admin`
    - Array Items → Add Item → Type: String, Value: `beta`

Output:
```json
{
  "user": {
    "name": "Alice",
    "age": 30,
    "tags": ["admin", "beta"]
  }
}
```

## Usage

1. Install the node (Community Nodes or `npm install n8n-nodes-rich-fields` in `.n8n/nodes`).
2. Add “Rich Fields” to your workflow.
3. Build the structure:
   - String/Number: set Name + Value.
   - Boolean: set Name + Value (true/false).
   - Object: add nested “Object Fields”.
   - Array: add “Array Items”.
4. Run the node; the assembled object is in `item.json`.

## Limits

- Max nesting depth: 10 levels (to keep UI and recursion safe).
- Array items are positional (no Name). For arrays of objects, choose Item → Type: Object.

## License

MIT.
