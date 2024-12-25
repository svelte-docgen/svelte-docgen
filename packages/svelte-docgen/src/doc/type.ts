import type { extract } from "@svelte-docgen/extractor";

import type { TypeKind } from "./kind.js";

export type Tag = NonNullable<ReturnType<typeof extract>["tags"]>[number];

export interface Docable {
	description?: string;
	tags?: Tag[];
}

export interface OptionalProp {
	default?: TypeOrRef;
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
	type: TypeOrRef;
} & (OptionalProp | RequiredProp) &
	(LocalProp | ExtendedProp);

export type Events = Map<string, TypeOrRef>;
export type Exports = Map<string, TypeOrRef>;
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

export type TypeOrRef = Type | TypeRef;

export function isTypeRef(type?: TypeOrRef): type is TypeRef {
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

export type TypeRef = string;

export interface ArrayType {
	kind: "array";
	isReadonly: boolean;
	element: TypeOrRef;
}

export interface Constructible extends WithName {
	kind: "constructible";
	name: string;
	constructors: Array<FnParam[]> | "self";
}

export interface OptionalFnParam {
	isOptional: true;
	default?: TypeOrRef;
}
export interface RequiredFnParam {
	isOptional: false;
	default?: never;
}
export type FnParam = {
	name: string;
	isOptional: boolean;
	default?: TypeOrRef;
	type: TypeOrRef;
} & (OptionalFnParam | RequiredFnParam);

export interface FnCall {
	parameters: (FnParam | "self")[];
	returns: TypeOrRef;
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
	types: TypeOrRef[];
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
	type: TypeOrRef;
}

export interface Tuple extends WithAlias {
	kind: "tuple";
	isReadonly: boolean;
	elements: TypeOrRef[];
}

export interface TypeParam {
	kind: "type-parameter";
	name: string;
	isConst: boolean;
	constraint: TypeOrRef;
	default?: TypeOrRef;
}

export interface Union extends WithAlias {
	kind: "union";
	types: TypeOrRef[];
	nonNullable?: TypeOrRef;
}
