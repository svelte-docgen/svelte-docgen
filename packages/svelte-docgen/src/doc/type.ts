import type { extract } from "@svelte-docgen/extractor";

import type { BaseTypeKind } from "../kind/core.js";

/**
 * Type reference as key in the map {@link Types}.
 * The purpose of this reference is to solve circularity issue with types with optional alias {@link WithAlias}
 * or types with required name {@link WithName}.
 */
export type TypeRef = string;

/**
 * Union of all possible types recognized by `svelte-docgen`.
 */
export type Type =
	| BaseType
	| Array
	| Constructible
	| Fn
	| Interface
	| Intersection
	| Literal
	| Tuple
	| TypeParam
	| Union
	| Index
	| IndexedAccess
	| Conditional
	| Substitution
	| TemplateLiteral
	| StringMapping;

export type TypeOrRef = Type | TypeRef;

/**
 * Type where `alias` is _optional_.
 */
export interface WithAlias {
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
	name: string;
	/**
	 * Where is this type declared?
	 */
	sources?: Set<string>;
}

/**
 * Represents a documentation tag in JSDoc
 */
export type Tag = NonNullable<ReturnType<typeof extract>["tags"]>[number];
export type DisplayPart = NonNullable<Tag["content"]>[number];

export interface Docable {
	description?: DisplayPart[];
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
export type Types = Map<TypeRef, (Type & WithAlias) | (Type & WithName)>;

export interface BaseType {
	/** @see {@link TypeKind} */
	kind: BaseTypeKind;
}

export interface Array extends WithAlias {
	kind: "array";
	isReadonly: boolean;
	element: TypeOrRef;
}

export interface Constructible extends WithName, WithAlias {
	kind: "constructible";
	name: string;
	constructors: FnParam[][];
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
	parameters: FnParam[];
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
	name: string;
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

export interface Union extends WithAlias {
	kind: "union";
	types: TypeOrRef[];
	nonNullable?: TypeOrRef;
}

export type AdvancedType = Array | Constructible | Fn | Interface | Intersection | Literal | Tuple | Union;

export interface TypeParam {
	kind: "type-parameter";
	name: string;
	isConst: boolean;
	constraint: TypeOrRef;
	default?: TypeOrRef;
}

export interface Index {
	kind: "index";
	type: TypeOrRef;
}

export interface IndexedAccess extends WithAlias {
	kind: "indexed-access";
	object: TypeOrRef;
	index: TypeOrRef;
	constraint?: TypeOrRef;
	// TODO: Commenting these out for now as it's unclear if they are useful for users
	// simplifiedForReading?: TypeOrRef;
	// simplifiedForWriting?: TypeOrRef;
}

export interface Conditional extends WithAlias {
	kind: "conditional";
	check: TypeOrRef;
	extends: TypeOrRef;
	truthy?: TypeOrRef;
	falsy?: TypeOrRef;
}

export interface Substitution {
	kind: "substitution";
	base: TypeOrRef;
	constraint: TypeOrRef;
}

export interface TemplateLiteral {
	kind: "template-literal";
	texts: readonly string[];
	types: TypeOrRef[];
}

export interface StringMapping {
	kind: "string-mapping";
	type: TypeOrRef;
	name: string;
}

export type InstantiableType =
	| Conditional
	| Index
	| IndexedAccess
	| StringMapping
	| Substitution
	| TemplateLiteral
	| TypeParam;
