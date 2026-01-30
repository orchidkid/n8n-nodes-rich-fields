"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichFields = void 0;
const { NodeApiError } = require("n8n-workflow");
const maxDepth = 10;
function collect(def, key, innerKey) {
    if (!def || !def[key])
        return [];
    const container = def[key];
    if (Array.isArray(container)) {
        const acc = [];
        for (const g of container) {
            if (g && g[innerKey])
                acc.push(...(Array.isArray(g[innerKey]) ? g[innerKey] : [g[innerKey]]));
        }
        return acc;
    }
    const inner = container[innerKey];
    if (!inner)
        return [];
    return Array.isArray(inner) ? inner : [inner];
}
function makeValueDefs(depth, typeKey = "type") {
    const defs = [];
    defs.push({
        displayName: "Type",
        name: typeKey,
        type: "options",
        default: "string",
        options: [
            { name: "String", value: "string" },
            { name: "Number", value: "number" },
            { name: "Boolean", value: "boolean" },
            { name: "Object", value: "object" },
            { name: "Array", value: "array" },
        ],
    });
    if (typeKey !== "itemType") {
        defs.push({
            displayName: "Name",
            name: "name",
            type: "string",
            default: "",
            description: depth === 1 ? "Key of the field in the output object" : "",
        });
    }
    defs.push({
        displayName: "Value",
        name: "value",
        type: "string",
        default: "",
        displayOptions: { show: { [typeKey]: ["string", "number"] } },
    });
    defs.push({
        displayName: "Value",
        name: "valueBool",
        type: "options",
        options: [
            { name: "true", value: true },
            { name: "false", value: false },
        ],
        default: true,
        displayOptions: { show: { [typeKey]: ["boolean"] } },
    });
    if (depth < maxDepth) {
        defs.push({
            displayName: "Object Fields",
            name: "objectFields",
            type: "fixedCollection",
            typeOptions: { multipleValues: true },
            default: {},
            displayOptions: { show: { [typeKey]: ["object"] } },
            options: [
                {
                    name: "field",
                    displayName: "Field",
                    values: makeValueDefs(depth + 1, "type"),
                },
            ],
        });
        defs.push({
            displayName: "Array Items",
            name: "arrayItems",
            type: "fixedCollection",
            typeOptions: { multipleValues: true },
            default: {},
            displayOptions: { show: { [typeKey]: ["array"] } },
            options: [
                {
                    name: "item",
                    displayName: "Item",
                    values: makeValueDefs(depth + 1, "itemType"),
                },
            ],
        });
    }
    return defs;
}
function buildValue(def, typeKey = "type") {
    const type = def[typeKey] || "string";
    if (type === "string") {
        return def.value || "";
    }
    if (type === "number") {
        const n = Number(def.value);
        if (Number.isNaN(n))
            throw new Error(`Field "${def.name || ""}" value is not a number`);
        return n;
    }
    if (type === "boolean") {
        return !!def.valueBool;
    }
    if (type === "array") {
        const out = [];
        const items = collect(def, "arrayItems", "item");
        for (const it of items) {
            out.push(buildValue(it, "itemType"));
        }
        return out;
    }
    if (type === "object") {
        const obj = {};
        const entries = collect(def, "objectFields", "field");
        for (const e of entries) {
            const key = e.name || "";
            obj[key] = buildValue(e, "type");
        }
        return obj;
    }
    return def.value;
}
class RichFields {
    constructor() {
        this.description = {
            displayName: "Rich Fields",
            name: "richFields",
            icon: "fa:code",
            group: ["transform"],
            version: 1,
            description: "Build complex fields (object/array) via UI",
            defaults: { name: "Rich Fields" },
            inputs: ["main"],
            outputs: ["main"],
            properties: [
                {
                    displayName: "Fields",
                    name: "fieldsCollection",
                    type: "fixedCollection",
                    typeOptions: { multipleValues: true },
                    default: {},
                    options: [
                        {
                            name: "field",
                            displayName: "Field",
                            values: makeValueDefs(1, "type"),
                        },
                    ],
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const fieldsColl = this.getNodeParameter("fieldsCollection", i, {});
                const fields = fieldsColl.field || [];
                const out = {};
                for (const f of fields) {
                    if (!f.name)
                        continue;
                    out[f.name] = buildValue(f, "type");
                }
                returnData.push({ ...items[i], json: out });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message, item: i });
                    continue;
                }
                throw new NodeApiError(this.getNode(), error);
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.RichFields = RichFields;
