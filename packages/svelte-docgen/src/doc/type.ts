import type { extract } from "@svelte-docgen/extractor";

import type { TypeKind } from "./kind.js";

export type Tag = NonNullable<ReturnType<typeof extract>["tags"]>[number];

export interface Docable {
	description?: string;
	tags?: Tag[];
}

export interface OptionalProp {
	default?: Type;
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
	type: Type;
} & (OptionalProp | RequiredProp) &
	(LocalProp | ExtendedProp);

/**
 * Type reference to the map {@link Types} keys.
 */
export type TypeRef = string;

export type Events = Map<string, Type | TypeRef>;
export type Exports = Map<string, Type | TypeRef>;
export type Props = Map<string, Prop>;
export type Slots = Map<string, Props>;
export type Types = Map<TypeRef, (Type & WithAlias) | (Type & WithName)>;

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

/**
 * Type where `alias` is _optional_.
 */
export interface WithAlias {
	kind: string;
	alias?: string;
	/**
	 * Where is this type declared?
	 */
	sources?: Set<string>;
}

/**
 * Type where `name` is **required**.
 */
export interface WithName {
	kind: string;
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

export interface ArrayType {
	kind: "array";
	isReadonly: boolean;
	element: Type | TypeRef;
}

export interface Constructible extends WithName {
	kind: "constructible";
	name: string;
	constructors: Array<FnParam[]>;
}

export interface OptionalFnParam {
	isOptional: true;
	default?: Type | TypeRef;
}
export interface RequiredFnParam {
	isOptional: false;
	default?: never;
}
export type FnParam = {
	name: string;
	isOptional: boolean;
	default?: Type | TypeRef;
	type: Type | TypeRef;
} & (OptionalFnParam | RequiredFnParam);

export interface FnCall {
	parameters: FnParam[];
	returns: Type | TypeRef;
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
	types: (Type | TypeRef)[];
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
}
export type Literal = LiteralBigInt | LiteralBoolean | LiteralNumber | LiteralString | LiteralSymbol;

export interface Member {
	isOptional: boolean;
	isReadonly: boolean;
	type: Type | TypeRef;
}

export interface Tuple extends WithAlias {
	kind: "tuple";
	isReadonly: boolean;
	elements: (Type | TypeRef)[];
}

export interface TypeParam {
	kind: "type-parameter";
	name: string;
	isConst: boolean;
	constraint: Type | TypeRef;
	default?: Type | TypeRef;
}

export interface Union extends WithAlias {
	kind: "union";
	types: (Type | TypeRef)[];
	nonNullable?: Type | TypeRef;
}
