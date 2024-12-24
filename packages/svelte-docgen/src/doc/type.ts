import type { extract } from "@svelte-docgen/extractor";

import type { TypeKind } from "./kind.js";

export type Tag = NonNullable<ReturnType<typeof extract>["tags"]>[number];

export interface Docable {
	description?: string;
	tags?: Tag[];
}

export interface OptionalProp {
	default?: TypeOrAlias;
	isOptional: true;
}
export interface RequiredProp {
	default?: never;
	isOptional: false;
}
export interface LocalProp {
	isExtended: false;
	sources?: never;
}
export interface ExtendedProp {
	isExtended: true;
	/** Where is this extended prop declared? */
	sources?: Set<string>;
}
export type Prop = Docable & {
	isBindable: boolean;
	type: TypeOrAlias;
} & (OptionalProp | RequiredProp) &
	(LocalProp | ExtendedProp);

export type Events = Map<string, TypeOrAlias>;
export type Exports = Map<string, TypeOrAlias>;
export type Props = Map<string, Prop>;
export type Slots = Map<string, Props>;
export type Types = Record<string, Type>;

export type Type =
	| BaseType
	| ArrayType
	| Constructible
	| Fn
	| Interface
	| Intersection
	| Literal
	| Tuple
	| TypeParam
	| Union;

export type TypeOrAlias = Type | Alias;

export function isAlias(type?: TypeOrAlias): type is Alias {
	return typeof type === "string";
}

export interface WithAlias {
	alias?: string;
	/**
	 * Where is this type declared?
	 */
	sources?: Set<string>;
}

export interface WithName {
	name: string;
	/**
	 * Where is this type declared?
	 */
	sources: Set<string>;
}

export interface BaseType {
	/** @see {@link TypeKind} */
	kind: Exclude<
		TypeKind,
		| "array"
		| "constructible"
		| "function"
		| "interface"
		| "intersection"
		| "literal"
		| "tuple"
		| "type-parameter"
		| "union"
	>;
}

export type Alias = string;

export interface ArrayType {
	kind: "array";
	isReadonly: boolean;
	element: TypeOrAlias;
}

export interface Constructible extends WithName {
	kind: "constructible";
	name: string;
	constructors: Array<FnParam[]> | "self";
}

export interface OptionalFnParam {
	isOptional: true;
	default?: TypeOrAlias;
}
export interface RequiredFnParam {
	isOptional: false;
	default?: never;
}
export type FnParam = {
	name: string;
	isOptional: boolean;
	default?: TypeOrAlias;
	type: TypeOrAlias;
} & (OptionalFnParam | RequiredFnParam);

export interface FnCall {
	parameters: (FnParam | "self")[];
	returns: TypeOrAlias;
}
export interface Fn extends WithAlias {
	kind: "function";
	calls: FnCall[];
}

export interface Interface extends WithAlias {
	kind: "interface";
	members: Map<string, Member>;
}

export interface Intersection extends WithAlias {
	kind: "intersection";
	types: TypeOrAlias[];
}

export interface LiteralBigInt {
	kind: "literal";
	subkind: "bigint";
	value: bigint;
}
export interface LiteralBoolean {
	kind: "literal";
	subkind: "boolean";
	value: boolean;
}
export interface LiteralNumber {
	kind: "literal";
	subkind: "number";
	value: number;
}
export interface LiteralString {
	kind: "literal";
	subkind: "string";
	value: string;
}
export interface LiteralSymbol {
	kind: "literal";
	subkind: "symbol";
	alias?: string;
}
export type Literal = LiteralBigInt | LiteralBoolean | LiteralNumber | LiteralString | LiteralSymbol;

export interface Member {
	isOptional: boolean;
	isReadonly: boolean;
	type: TypeOrAlias;
}

export interface Tuple extends WithAlias {
	kind: "tuple";
	isReadonly: boolean;
	elements: TypeOrAlias[];
}

export interface TypeParam {
	kind: "type-parameter";
	name: string;
	isConst: boolean;
	constraint: TypeOrAlias;
	default?: TypeOrAlias;
}

export interface Union extends WithAlias {
	kind: "union";
	types: TypeOrAlias[];
	nonNullable?: TypeOrAlias;
}
