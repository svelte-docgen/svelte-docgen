/**
 * JavaScript namespace `is` declaration for type guards.
 * @module
 */

import { isTypeRef, isAdvancedType, isBaseType, isInstantiableType } from "./guard.js";

export {
	isTypeRef as typeRef,
	isAdvancedType as advancedType,
	isBaseType as baseType,
	isInstantiableType as instantiableType,
};
