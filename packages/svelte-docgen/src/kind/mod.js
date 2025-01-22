/**
 * JavaScript namespace `is` declaration for type guards.
 * @module
 */

import { isTypeRef, isStructuredType, isBaseType, isInstantiableType } from "./guard.js";

export {
	isTypeRef as typeRef,
	isStructuredType as structuredType,
	isBaseType as baseType,
	isInstantiableType as instantiableType,
};
