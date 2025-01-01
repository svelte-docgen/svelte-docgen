/**
 * Related to AST transformation.
 * @module
 */

/**
 * @import AST from "estree";
 */

import { walk } from "zimmerframe";

/**
 * ## Problem
 *
 * In JavaScript is not possible to stringify JavaScript built-in objects.
 * In our case {@link Map} and {@link Set}, and their entries.
 *
 * ## Solution
 *
 * This function takes the AST of stringified encoded _(as valid JSON format)_ data.
 * Then it looks for the specific object keys,
 * and wrap their encoded entries _(as arrays)_ like so:
 * - `new Map(<value>)`,
 * -  or `new Set(<value>)`.
 *
 * @param {AST.Node} ast parsed AST compliant with [ESTree specification](https://github.com/estree/estree)
 * @returns {AST.Node} modified AST which can be printed
 */
export function transform_encoded(ast) {
	return walk(ast, null, {
		Property(node, ctx) {
			if (
				node.key.type === "Literal" &&
				typeof node.key.value === "string" &&
				node.value.type === "ArrayExpression"
			) {
				/* Revive `sources` entry value as {@link Set} */
				if (node.key.value === "sources") {
					return /** @type {AST.Property} */ ({
						...node,
						value: {
							type: "NewExpression",
							callee: {
								type: "Identifier",
								name: "Set",
							},
							arguments: [node.value],
						},
					});
				}
				/* Revive `members` entry value as {@link Map} */
				if (node.key.value === "members") {
					return /** @type {AST.Property} */ ({
						...node,
						value: {
							type: "NewExpression",
							callee: {
								type: "Identifier",
								name: "Map",
							},
							arguments: [ctx.visit(node.value)],
						},
					});
				}
				const is_toplevel =
					/** @type {AST.ObjectExpression} */ (ctx.path[ctx.path.length - 1]).properties.find(
						(p) => p.type === "Property" && p.key.type === "Literal" && p.key.value === "props",
					) !== undefined;
				if (is_toplevel) {
					/** Revive those keys values as {@link Map} */
					if (["events", "exports", "props", "types", "slots"].includes(node.key.value)) {
						return /** @type {AST.Property} */ ({
							...node,
							value: {
								type: "NewExpression",
								callee: {
									type: "Identifier",
									name: "Map",
								},
								arguments: [ctx.visit(node.value)],
							},
						});
					}
				}
			}
			// NOTE: Go to the next object property
			ctx.next();
		},
	});
}
