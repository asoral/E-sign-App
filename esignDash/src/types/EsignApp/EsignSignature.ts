
export interface EsignSignature{
	name: string
	creation: string
	modified: string
	owner: string
	modified_by: string
	docstatus: 0 | 1 | 2
	parent?: string
	parentfield?: string
	parenttype?: string
	idx?: number
	/**	Username : Link - User	*/
	username?: string
	/**	Signature Name : Small Text	*/
	signature_name?: string
	/**	Amended From : Link - EsignSignature	*/
	amended_from?: string
}